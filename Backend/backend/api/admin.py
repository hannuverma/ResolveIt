from django.contrib import admin
from .models import User, Department, Complaint, Feedback, Branch, DepartmentPointTransaction

admin.site.register(User)
admin.site.register(Department)
admin.site.register(Complaint)
admin.site.register(Feedback)
admin.site.register(Branch)
admin.site.register(DepartmentPointTransaction)
# Register your models here.
