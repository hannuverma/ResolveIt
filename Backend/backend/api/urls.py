from django.contrib import admin
from django.urls import path, include
from . import views
urlpatterns = [
    path('profile/', views.Profile, name='profile'),
    path('complaints/', views.ComplaintViewSet.as_view({'get': 'list', 'post': 'create'}), name='complaints'),
    path('complaints/<int:pk>/', views.ComplaintViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'put': 'update', 'delete': 'destroy'}), name='complaint-detail'),
    path('complaints/<int:complaint_id>/feedback/', views.handle_feedback, name='complaint-feedback'),
    path('departments/<int:department_id>/points/', views.getDepartmentPoints, name='department-points'),
    path('admin/addstudents/', views.CreateUserView.as_view(), name='add-student'),
    path('admin/removestudents/<str:identifier>/', views.removeStudent, name='remove-student'),
    path('admin/adddepartments/', views.addDepartment, name='add-department'),
    path('admin/removedepartments/<str:identifier>/', views.removeDepartment, name='remove-department'),
    path('admin/getdepartments/', views.getAllDepartments, name='get-departments'),
]