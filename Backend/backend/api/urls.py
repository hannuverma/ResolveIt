from django.contrib import admin
from django.urls import path, include
from . import views
urlpatterns = [
    path('profile/', views.Profile, name='profile'),
    path('complaints/', views.ComplaintViewSet.as_view({'get': 'list', 'post': 'create'}), name='complaints'),
    path('complaints/<int:complaint_id>/feedback/', views.handle_feedback, name='complaint-feedback'),
    path('departments/<int:department_id>/points/', views.getDepartmentPoints, name='department-points'),
]