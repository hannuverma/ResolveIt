from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User, Department, Complaint, Feedback, Branch, DepartmentPointTransaction, College


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "college",
            "department",
            "branch",
            "roll_no",
        )


class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "college",
            "department",
            "branch",
            "roll_no",
            "is_active",
            "is_staff",
            "is_superuser",
        )

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User

    list_display = ("username", "email", "role", "college", "is_active", "is_staff")
    list_filter = ("role", "college", "is_active", "is_staff")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("username",)

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email", "roll_no")}),
        ("Organization", {"fields": ("role", "college", "department", "branch")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username",
                "email",
                "first_name",
                "last_name",
                "role",
                "college",
                "department",
                "branch",
                "roll_no",
                "password1",
                "password2",
                "is_active",
                "is_staff",
                "is_superuser",
            ),
        }),
    )

    def save_model(self, request, obj, form, change):
        # If creating a new user and college wasn't selected, default to the admin's college
        if not obj.pk:
            if not obj.college and request.user.college:
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
