from django.contrib import admin
from django.urls import path, include
from . import views
urlpatterns = [
    path('login/', views.loginUser, name='login'),
    path('complaints/', views.ComplaintViewSet.as_view({'get': 'list', 'post': 'create'}), name='complaints'),
]