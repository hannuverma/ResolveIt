from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    reward_points = models.IntegerField(default=0)  
    
    def __str__(self):
        return f"{self.name}"

class Branch(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class User(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = 'STUDENT', 'Student'
        DEPARTMENT_STAFF = 'DEPT', 'Department Staff'
        ADMIN = 'ADMIN', 'Administrator'
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=Roles.choices, default=Roles.STUDENT)
    
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)

    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    is_password_changed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Complaint(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending (AI Assigned)'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        RESOLVED = 'RESOLVED', 'Resolved'
        CLOSED = 'CLOSED', 'Closed by Student'

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='complaints')
    title = models.CharField(max_length=200, default='No Title', blank=True)

    image = models.ImageField(upload_to='complaints/')
    description = models.TextField()
    assigned_department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='tasks')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High')], default='MEDIUM')

    def __str__(self):
        return f"Complaint #{self.id} - {self.status}"

 
class Feedback(models.Model):

    complaint = models.OneToOneField(Complaint, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)]) 
    review_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        super().save(*args, **kwargs)
        
        dept = self.complaint.assigned_department
        if dept:
            if self.rating >= 4:
                dept.reward_points += 10
            elif self.rating == 3:
                dept.reward_points += 5
            else:
                dept.reward_points -= 5
            dept.save()

    def __str__(self):
        return f"Rating: {self.rating} stars for Complaint #{self.complaint.id}"