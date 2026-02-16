from rest_framework import serializers
from .models import User, Complaint, Feedback, Department, DepartmentPointTransaction, AlertMessage
from django.db.models import Avg


class alertSerializer(serializers.ModelSerializer):
    created_at_formatted = serializers.SerializerMethodField()
    estimated_resolution_time_formatted = serializers.SerializerMethodField()

    class Meta:
        model = AlertMessage
        fields = ['id', 'college', 'message', 'created_at', 'estimated_resolution_time', 'created_at_formatted', 'estimated_resolution_time_formatted']
        read_only_fields = ['id', 'created_at']

    def get_created_at_formatted(self, obj):
        if obj.created_at:
            return obj.created_at.strftime('%B %d, %Y at %I:%M %p')
        return None

    def get_estimated_resolution_time_formatted(self, obj):
        if obj.estimated_resolution_time:
            return obj.estimated_resolution_time.strftime('%B %d, %Y at %I:%M %p')
        return None

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

    def validate(self, attrs):
        # Get college from context (set by the view)
        request = self.context.get('request')
        college = None
        if request and request.user.is_authenticated:
            college = request.user.college
        
        roll_no = attrs.get('roll_no')
        username = attrs.get('username')
        
        # Check for existing roll_no in the same college
        if roll_no and college:
            if User.objects.filter(roll_no=roll_no, college=college).exists():
                raise serializers.ValidationError({
                    'roll_no': f'A student with roll number {roll_no} already exists in this college.'
                })
        
        # Check for existing username in the same college
        if username and college:
            if User.objects.filter(username=username, college=college).exists():
                raise serializers.ValidationError({
                    'username': f'A student with username {username} already exists in this college.'
                })
        
        return attrs

    def create(self, validated_data):
        roll_no = validated_data.get("roll_no")
        
        user = User(**validated_data)
        user.set_password(roll_no)
        user.save()

        return user
    
class departmentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    no_of_complaints = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'reward_points', 'college', 'code', 'user', 'description', 'no_of_complaints']
        read_only_fields = ['id']

    def get_no_of_complaints(self, obj):
        if not hasattr(obj, 'tasks'):
            return 0
        return obj.tasks.filter(repeated_complaint=False).count()

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
