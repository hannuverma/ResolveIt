from rest_framework import serializers
from .models import User, Complaint, Feedback, Department, DepartmentPointTransaction
from django.db.models import Avg


class StudentGridSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'roll_no',
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        roll_no = validated_data.get("roll_no")
        
        user = User(**validated_data)
        user.set_password(roll_no)
        user.save()

        return user
    
class departmentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'reward_points', 'college', 'code', 'user']
        read_only_fields = ['id']

    def get_user(self, obj):
        if obj.user:
            return {
                'username': obj.user.username,
            }
        return None

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'complaint', 'rating', 'review_text']
        read_only_fields = ['id', 'complaint']


class ComplaintSerializer(serializers.ModelSerializer):
    # Expose only the department's name (no user/email/code)
    assigned_department = serializers.CharField(source='assigned_department.name', read_only=True)
    image = serializers.ImageField(max_length=None, use_url=True)
    feedback = FeedbackSerializer(read_only=True)
    # Only expose `roll_no` to admins or the complaint owner; hide for department staff
    roll_no = serializers.SerializerMethodField()
    group_average_rating = serializers.SerializerMethodField()

    def get_group_average_rating(self, obj):
        # Handle both model instances and dictionaries
        similarity_hash = obj.similarity_hash if hasattr(obj, 'similarity_hash') else obj.get('similarity_hash') if isinstance(obj, dict) else None
        
        if not similarity_hash:
            return None

        # Aggregate feedback ratings across ALL complaints with the same similarity_hash
        # that have feedback, regardless of which complaint the feedback was submitted on
        from .models import Feedback
        feedbacks = Feedback.objects.filter(
            complaint__similarity_hash=similarity_hash
            
        )
        
        if not feedbacks.exists():
            return None
        
        ratings = [fb.rating for fb in feedbacks]
        if not ratings:
            return None
        
        avg = sum(ratings) / len(ratings)
        return round(avg)


    class Meta:
        model = Complaint
        fields = ['id', 'student', 'image', 'description', 'assigned_department',
                  'status', 'created_at', 'resolved_at', 'priority', 'title', 'feedback', 'roll_no','group_average_rating',]
        read_only_fields = ['id', 'student', 'created_at']

    def get_roll_no(self, obj):
        request = self.context.get('request') if self.context else None
        
        # Handle both model instances and dictionaries
        student = obj.student if hasattr(obj, 'student') else obj.get('student') if isinstance(obj, dict) else None
        
        # If no request context, be conservative and return the value
        if not request or not hasattr(request, 'user'):
            return student.roll_no if student and hasattr(student, 'roll_no') else None

        user = request.user
        # Admins can see roll_no
        if getattr(user, 'role', None) == 'ADMIN':
            return student.roll_no if student and hasattr(student, 'roll_no') else None
        
        # Check if current user is the complaint's student (compare by ID)
        if student and hasattr(student, 'id') and hasattr(user, 'id') and student.id == user.id:
            return student.roll_no if hasattr(student, 'roll_no') else None

        # Department staff and others should NOT receive identifying student details
        return None


class DepartmentPointTransactionSerializer(serializers.ModelSerializer):
    department = serializers.StringRelatedField()
    complaint = ComplaintSerializer(read_only=True)

    class Meta:
        model = DepartmentPointTransaction
        fields = [
            'id',
            'department',
            'complaint',
            'points',
            'transaction_type',
            'alloted_at',
        ]
        read_only_fields = [
            'id',
            'department',
            'complaint',
            'points',
            'transaction_type',
            'alloted_at',
        ]
