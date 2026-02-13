from datetime import timezone
from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import api_view
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
from .services import add_department_points, apply_unresolved_penalties, process_complaint_rating
from rest_framework.decorators import api_view
import requests

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
def removeStudent(request, roll_no):
    try:
        student = User.objects.get(roll_no=roll_no, role='STUDENT')
        student.delete()
        return Response({"message": "Student removed successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
def run_daily_penalties(request):
    apply_unresolved_penalties()
    return Response({"message": "Penalties applied"})

@api_view(['POST'])
def addDepartment(request):
    name = request.data.get('department_name')
    username = request.data.get('username')
    password = request.data.get('password')
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
    dept, created = Department.objects.get_or_create(
        name=name,
        code=code,
        college=college,
        defaults={'reward_points': 0}
    )
    
    if created:
        # Create department user
        dept_user = User.objects.create(
            username=username,
            role='DEPT',
            college=college,
            department=dept
        )
        dept_user.set_password(password)
        dept_user.save()
    
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
            feedback = Feedback.objects.get(complaint_id=complaint_id)
            serializer = FeedbackSerializer(feedback)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Feedback.DoesNotExist:
            return Response({'error': 'Feedback not found'}, status=status.HTTP_404_NOT_FOUND)

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
            # Save while manually passing the complaint object
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
        # Dept staff should see complaints assigned to them
        elif self.request.user.role == 'DEPT':
            return Complaint.objects.filter(assigned_department=self.request.user.department)
        
        elif self.request.user.role == 'ADMIN':
            return Complaint.objects.all()
        
        return super().get_queryset()

    def perform_create(self, serializer):

        img = self.request.FILES.get('image')
        description = self.request.data.get('description')

        # ✅ Always initialize variables first
        dept_name = None
        title = None
        priority = None
        department = None

        try:
            ai_response = requests.post(
                "http://localhost:4000/api/analyze_complaint/",
                json={"description": description},
                timeout=5
            )
            ai_response.raise_for_status()

            data = ai_response.json()

            dept_name = data.get("department")
            title = data.get("title")
            priority = data.get("priority")

        except requests.RequestException:
            print("AI request failed")

        # Get or create department safely
        if dept_name:
            department, _ = Department.objects.get_or_create(name=dept_name)


        if not priority:
            priority = "MEDIUM"


        serializer.save(
            student=self.request.user,
            assigned_department=department,
            title=title,
            priority=priority,
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
    
        
@api_view(['GET'])
def getDepartmentPoints(request, department_id):
    try:
        department = Department.objects.get(id=department_id)
    except Department.DoesNotExist:
        return Response({'error': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)

    transactions = DepartmentPointTransaction.objects.filter(department=department)
    serializer = DepartmentPointTransactionSerializer(transactions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

