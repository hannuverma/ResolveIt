from django.utils import timezone
from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from django.db import transaction
import traceback
from django.contrib.auth import authenticate, login as django_login
from .serializers import StudentGridSerializer, ComplaintSerializer, FeedbackSerializer, departmentSerializer, DepartmentPointTransactionSerializer
from .models import Complaint, DepartmentPointTransaction, Feedback, Department
from .models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, status
from .services import add_department_points, apply_unresolved_penalties, process_complaint_rating, get_group_average_rating
from rest_framework.decorators import api_view
import requests
from dotenv import load_dotenv
import os
from django.db.models import Avg
from rest_framework.exceptions import ValidationError


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = StudentGridSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        # Auto-assign the admin's college if the admin is authenticated
        if self.request.user.is_authenticated and self.request.user.college:
            user.college = self.request.user.college
            user.save()

@api_view(['DELETE'])
def removeStudent(request, identifier):
    # Allow deleting by roll_no or username
    try:
        # Prefer username match
        student = None
        try:
            student = User.objects.get(username=identifier, role='STUDENT')
        except User.DoesNotExist:
            student = None

        if not student:
            student = User.objects.get(roll_no=identifier, role='STUDENT')

        student.delete()
        return Response({"message": "Student removed successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
def removeDepartment(request, identifier):
    # Allow deleting by department code, or by linked department user username
    try:
        dept = None
        # Try code match first
        try:
            dept = Department.objects.get(code=identifier, college=request.user.college)
        except Department.DoesNotExist:
            dept = None

        # Try linked user username
        if not dept:
            try:
                dept = Department.objects.get(user__username=identifier)
            except Department.DoesNotExist:
                dept = None

        # Try name match as last resort
        if not dept:
            try:
                dept = Department.objects.get(name=identifier)
            except Department.DoesNotExist:
                dept = None

        if not dept:
            return Response({"error": "Department not found"}, status=status.HTTP_404_NOT_FOUND)

        dept.delete()
        return Response({"message": "Department removed successfully"}, status=status.HTTP_200_OK)
    except Exception:
        traceback.print_exc()
        return Response({"error": "Failed to remove department"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def run_daily_penalties(request):
    apply_unresolved_penalties()
    return Response({"message": "Penalties applied"})


@api_view(['POST'])
def addDepartment(request):
    name = request.data.get('department_name')
    username = request.data.get('username')
    password = request.data.get('password')
    description = request.data.get('description')
    code = request.data.get('code')  # Optional code for student invitations
    
    if not name:
        return Response({"error": "Department name is required"}, status=status.HTTP_400_BAD_REQUEST)
    if not username or not password:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Auto-assign the admin's college if authenticated
    college = None
    if request.user.is_authenticated and request.user.college:
        college = request.user.college
    
    # Create department
    from django.db import transaction

    try:
        with transaction.atomic():
            dept, created = Department.objects.get_or_create(
                name=name,
                college=college,
                defaults={'reward_points': 0, 'code': code, 'description': description}
            )

            # If department user doesn't exist or department has no linked user, create and attach
            if username and password:
                user_qs = User.objects.filter(username=username, college=college)
                if user_qs.exists():
                    dept_user = user_qs.first()
                    # ensure role and department are set
                    dept_user.role = 'DEPT'
                    dept_user.department = dept
                    dept_user.save()
                else:
                    dept_user = User.objects.create(
                        username=username,
                        role='DEPT',
                        college=college,
                        department=dept
                    )
                    dept_user.set_password(password)
                    dept_user.save()

                # attach OneToOne link on Department if not already set
                if not dept.user or dept.user != dept_user:
                    dept.user = dept_user
                    dept.save()

    except Exception:
        traceback.print_exc()
        return Response({"error": "Failed to create department or user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    serializer = departmentSerializer(dept)
    return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['GET'])
def Profile(request):

    user = request.user
    profile = {
        "id" : user.id,
        "username" : user.username,
        "first_name" : user.first_name,
        "last_name" : user.last_name,
        "role" : user.role,
        "department" : user.department.name if user.department else None,
        "college_name" : user.college_name,
        "is_password_changed" : user.is_password_changed,
    }
    return Response(profile, status=status.HTTP_200_OK)

    
@api_view(['GET', 'POST'])
def handle_feedback(request, complaint_id):
    # GET: Retrieve feedback
    if request.method == 'GET':
        try:
            complaint = Complaint.objects.get(id=complaint_id)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

        # GROUP AVERAGE
        data = (
            Complaint.objects
            .filter(
                similarity_hash=complaint.similarity_hash,
                assigned_department=complaint.assigned_department,
                feedback__isnull=False
            )
            .aggregate(
                average=Avg('feedback__rating'),
            )
        )



        if data['average'] is None:
            return Response({'error': 'No feedback yet'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "rating": round(data['average']),
        }, status=status.HTTP_200_OK)
    
    # POST: Create feedback
    elif request.method == 'POST':
        try:
            complaint = Complaint.objects.get(id=complaint_id)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)
        if complaint.status != 'RESOLVED':
            return Response({'error': 'Feedback can only be submitted for resolved complaints'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Feedback.objects.filter(complaint=complaint).exists():
            return Response({'error': 'Feedback already submitted for this complaint'}, status=status.HTTP_400_BAD_REQUEST)


        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            # Save while manually passing the complaint oFbject
            serializer.save(complaint=complaint)
            process_complaint_rating(complaint) # Handle points after saving feedback
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'STUDENT':
            return Complaint.objects.filter(student=self.request.user)
        # Dept staff should see complaints assigned to them in their college
        elif self.request.user.role == 'DEPT':
            return Complaint.objects.filter(
                assigned_department=self.request.user.department,
                student__college=self.request.user.college,
                repeated_complaint=False
            )
        
        elif self.request.user.role == 'ADMIN':
            return Complaint.objects.filter(student__college=self.request.user.college, repeated_complaint=False)
        
        return super().get_queryset()

    def perform_create(self, serializer):

        img = self.request.FILES.get('image')
        description = self.request.data.get('description')

        # ✅ Always initialize variables first
        dept_name = None
        title = None
        priority = None
        department = None
        similarity_hash = None

        try:
            load_dotenv()  # Load environment variables from .env file
            ai_response = requests.post(
                os.getenv("AI_LAYER_API"),
                json={"description": description},
                timeout=5
            )
            ai_response.raise_for_status()

            data = ai_response.json()

            dept_name = data.get("department")
            title = data.get("title")
            priority = data.get("priority")
            similarity_hash = data.get("similarity_hash")

        
        except requests.RequestException:
            print("AI request failed")
            

        # Resolve department by department-user username first (department usernames are unique),
        # then fall back to name lookups/creation to avoid MultipleObjectsReturned.
        repeated = False
        
        if Complaint.objects.filter(similarity_hash=similarity_hash).exists():
            if Complaint.objects.filter(student__college=self.request.user.college).exists():
                repeated = True
            if Complaint.objects.filter(similarity_hash=similarity_hash, student=self.request.user, student__college=self.request.user.college).exists():
                existing_complaint = Complaint.objects.filter(similarity_hash=similarity_hash, student=self.request.user, student__college=self.request.user.college).first()
                print("Found existing complaint by same student with same similarity hash:", existing_complaint.id)
                raise ValidationError({
                    "detail": "You have already submitted a similar complaint",
                    "complaint_id": existing_complaint.id
                })                
            else:
                existing_complaint = Complaint.objects.filter(similarity_hash=similarity_hash).first()
                print("Found existing complaint with same similarity hash:", existing_complaint.id)
                if existing_complaint.status != Complaint.Status.RESOLVED and existing_complaint.student.username != self.request.user.username:
                    existing_complaint.times_reported += 1
                    
                    print("reported by different student")
                    if existing_complaint.times_reported >= 7 and existing_complaint.status != 'RESOLVED':
                        existing_complaint.priority = 'HIGH'

                    elif existing_complaint.times_reported >= 4 and existing_complaint.status != 'RESOLVED':
                        existing_complaint.priority = 'MEDIUM'
                    priority = existing_complaint.priority
                    existing_complaint.save()

            
        if dept_name:
            department = None
            try:
                # Try to find department whose linked user has this username
                department = Department.objects.filter(user__username=dept_name).first()
            except Exception:
                department = None

            # If not found, try to find by name within student's college
            if not department:
                try:
                    if self.request.user and getattr(self.request.user, 'college', None):
                        department = Department.objects.filter(name=dept_name, college=self.request.user.college).first()
                except Exception:
                    department = None

            department = Department.objects.filter(
                                                    name=dept_name,
                                                    college=self.request.user.college
                                                   ).first()
            # If still not found, create one (attach to student's college when available)
            if not department:
                department = Department.objects.create(name=dept_name, college=(self.request.user.college if getattr(self.request.user, 'college', None) else None))


        if not priority:
            priority = "LOW"

        serializer.save(
            student=self.request.user,
            assigned_department=department,
            title=title,
            priority=priority,
            similarity_hash=similarity_hash,
            repeated_complaint=repeated,
            status=Complaint.Status.PENDING if department else Complaint.Status.PENDING
        )

    def _normalize_update_data(self, data):
        normalized = data.copy()

        status_value = normalized.get("status")
        if isinstance(status_value, str):
            normalized["status"] = status_value.upper()
        return normalized

    def _filter_allowed_fields(self, data):
        allowed_fields = {"status"}
        return {key: value for key, value in data.items() if key in allowed_fields}

    def update(self, request, *args, **kwargs):
        if request.user.role not in ("DEPT", "ADMIN"):
            return Response({"detail": "You do not have permission to update complaints."}, status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()

        if request.user.role == "DEPT" and instance.assigned_department != request.user.department:
            return Response({"detail": "You can only update complaints assigned to your department."}, status=status.HTTP_403_FORBIDDEN)

        data = self._filter_allowed_fields(request.data)
        if not data:
            return Response({"detail": "No updatable fields provided."}, status=status.HTTP_400_BAD_REQUEST)

        data = self._normalize_update_data(data)
        serializer = self.get_serializer(instance, data=data, partial=False)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        if request.user.role not in ("DEPT", "ADMIN"):
            return Response({"detail": "You do not have permission to update complaints."}, status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()

        if request.user.role == "DEPT" and instance.assigned_department != request.user.department:
            return Response({"detail": "You can only update complaints assigned to your department."}, status=status.HTTP_403_FORBIDDEN)

        data = self._filter_allowed_fields(request.data)
        if not data:
            return Response({"detail": "No updatable fields provided."}, status=status.HTTP_400_BAD_REQUEST)

        data = self._normalize_update_data(data)
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        # Override to cascade RESOLVED status to complaints with the same similarity_hash
        instance = serializer.instance
        old_status = instance.status

        # Save the instance first
        with transaction.atomic():
            super().perform_update(serializer)

            # After save, if the status changed to RESOLVED and the updater is dept/admin, cascade
            new_status = serializer.instance.status
            try:
                updater = self.request.user
            except Exception:
                updater = None

            if old_status != Complaint.Status.RESOLVED and new_status == Complaint.Status.RESOLVED:
                # Only cascade when updated by department staff or admin
                if updater and getattr(updater, 'role', None) in ("DEPT", "ADMIN"):
                    sim_hash = serializer.instance.similarity_hash
                    if sim_hash:
                        # Update all other complaints with same similarity_hash to RESOLVED
                        related_qs = Complaint.objects.filter(similarity_hash=sim_hash).exclude(id=serializer.instance.id)
                        # Optionally restrict to same department if you want:
                        # related_qs = related_qs.filter(assigned_department=serializer.instance.assigned_department)
                        now = timezone.now()
                        for c in related_qs:
                            if c.status != Complaint.Status.RESOLVED:
                                c.status = Complaint.Status.RESOLVED
                                c.resolved_at = now
                                c.save()
    
        
@api_view(['GET'])
def getDepartmentPoints(request, department_id):
    try:
        department = Department.objects.get(id=department_id)
    except Department.DoesNotExist:
        return Response({'error': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)

    transactions = DepartmentPointTransaction.objects.filter(department=department)
    serializer = DepartmentPointTransactionSerializer(transactions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def getAllDepartments(request):
    # Allow passing a username query param to fetch departments for that user's college
    username = request.GET.get('username')
    college = None

    if username:
        try:
            target_user = User.objects.get(username=username)
            college = target_user.college
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        if not request.user or not request.user.is_authenticated:
            return Response({"error": "Authentication required or provide username"}, status=status.HTTP_401_UNAUTHORIZED)
        college = request.user.college

    departments = Department.objects.filter(college=college)

    serializer = departmentSerializer(departments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
