from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings



class College(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    # The code used to invite students (optional)
    code = models.CharField(max_length=20, unique=True, null=True, blank=True) 

    def __str__(self):
        return f"{self.name} - {self.code if self.code else 'No Code'}"

class Department(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, default=None)
    # Link to the department's user account (if this department has a login)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='department_account')
    name = models.CharField(max_length=100)
    reward_points = models.IntegerField(default=0)  
    code = models.CharField(max_length=20, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        # Ensures one college can't have two departments with same name or code
        # but different colleges can both have same names and codes
        unique_together = [('college', 'name'), ('college', 'code')]

    def __str__(self):
        if self.user:
            return f"{self.name} ({self.user.username}) - {self.code}"
        return f"{self.name} - {self.code}"



class User(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = 'STUDENT', 'Student'
        DEPARTMENT_STAFF = 'DEPT', 'Department Staff'
        ADMIN = 'ADMIN', 'Administrator'


    college = models.ForeignKey(College, on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(null=True, blank=True, unique=False) 
    role = models.CharField(max_length=10, choices=Roles.choices, default=Roles.STUDENT)
    roll_no = models.CharField(max_length=20, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True, related_name='members')
    is_password_changed = models.BooleanField(default=False)

    class Meta:
        unique_together = [('college', 'username'), ('college', 'roll_no')]

    @property
    def college_name(self):
        return self.college.name if self.college else "No College"
    
    def __str__(self):
        if self.role == self.Roles.STUDENT and self.roll_no:
            return f"{self.roll_no} ({self.username}) - {self.college_name}"
        return f"{self.username} ({self.role})"

class Complaint(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending (AI Assigned)'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        RESOLVED = 'RESOLVED', 'Resolved'
        CLOSED = 'CLOSED', 'Closed by Student'


    college = models.ForeignKey(College, on_delete=models.CASCADE, default=None)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='complaints')
    title = models.CharField(max_length=200, default='No Title', blank=True)
    similarity_hash = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='complaints', null=True, blank=True)
    description = models.TextField()
    assigned_department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='tasks')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High')], default='MEDIUM')
    repeated_complaint = models.BooleanField(default=False)  # Flag to indicate if this is a repeated complaint
    times_reported = models.IntegerField(default=1)  # For tracking how many times a similar complaint has been reported

    def save(self, *args, **kwargs):
        if self.status == self.Status.RESOLVED and self.resolved_at is None:
            self.resolved_at = timezone.now()

        if not self.college and self.student:
            self.college = self.student.college

        elif self.status != 'RESOLVED':
            self.resolved_at = None
            
        super().save(*args, **kwargs)
        

    def __str__(self):
        return f"Complaint #{self.id} - {self.status}"

 
class Feedback(models.Model):

    complaint = models.OneToOneField(Complaint, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)]) 
    review_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


    def __str__(self):
        return f"Rating: {self.rating} stars for Complaint #{self.complaint.id}"
    
class DepartmentPointTransaction(models.Model):

    TRANSACTION_TYPES = [
        ("RESOLVE", "Complaint Resolved"),
        ("REVIEW", "Review Rating"),
        ("PENALTY", "Penalty"),
        ("SPEED", "Speed Bonus")
    ]

    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    complaint = models.ForeignKey(Complaint, on_delete=models.DO_NOTHING, null=True, blank=True)
    points = models.IntegerField()
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    penalty_day = models.IntegerField(null=True, blank=True)
    alloted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.points} points for {self.department.name}"