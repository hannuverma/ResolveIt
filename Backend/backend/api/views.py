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

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = StudentGridSerializer
    permission_classes = [AllowAny]


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
    



# Create your views here.

