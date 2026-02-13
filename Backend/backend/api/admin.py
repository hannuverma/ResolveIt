from django.contrib import admin
from .models import User, Department, Complaint, Feedback, Branch, DepartmentPointTransaction, College

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    # Hide the college field so the admin doesn't have to select it manually
    exclude = ('college',) 
    
    def save_model(self, request, obj, form, change):
        # If the admin is creating a new user, automatically assign the admin's college
        if not obj.pk: 
            # Assuming the logged-in admin already has a college assigned
            if request.user.college:
                obj.college = request.user.college
        super().save_model(request, obj, form, change)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    exclude = ('college',)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            if request.user.college:
                obj.college = request.user.college
        super().save_model(request, obj, form, change)

admin.site.register(College)
admin.site.register(Complaint)
admin.site.register(Feedback)
admin.site.register(Branch)
admin.site.register(DepartmentPointTransaction)
# Register your models here.
