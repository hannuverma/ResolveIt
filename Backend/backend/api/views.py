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
from .serializers import StudentGridSerializer, ComplaintSerializer, FeedbackSerializer, departmentSerializer
from .models import Complaint, Feedback, Department
from .models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, status
from .services import add_department_points, apply_unresolved_penalties, process_complaint_rating

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = StudentGridSerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
def run_daily_penalties(request):
    apply_unresolved_penalties()
    return Response({"message": "Penalties applied"})


@api_view(['POST'])
def loginUser(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    user = authenticate(request, email=email, password=password)
    if user is not None:
        django_login(request, user)
    else:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    profile = {
        "id" : user.id,
        "username" : user.username,
        "email" : user.email,
        "first_name" : user.first_name,
        "last_name" : user.last_name,
        "role" : user.role,
        "department" : user.department.name if user.department else None,
        "branch" : user.branch.name if user.branch else None,
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
        # 1. Get the uploaded data
        img = self.request.FILES.get('image')
        desc = self.request.data.get('description')
        title = "hello"
        # 2. Run AI to get the department name
        dept_name = "Electrical"

        # 3. Find the Department object in your DB
        # Use get_or_create so the app doesn't crash if the AI picks a new category
        dept, created = Department.objects.get_or_create(name=dept_name)

        # 4. Save the complaint with the student and the AI-assigned department
        serializer.save(student=self.request.user, assigned_department=dept)
