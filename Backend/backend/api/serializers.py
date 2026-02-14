from rest_framework import serializers
from .models import User, Complaint, Feedback, Department, DepartmentPointTransaction





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
    roll_no = serializers.CharField(source='student.roll_no', read_only=True)
    class Meta:
        model = Complaint
        fields = ['id', 'student', 'image', 'description', 'assigned_department',
                  'status', 'created_at', 'resolved_at', 'priority', 'title', 'feedback', 'roll_no']
        read_only_fields = ['id', 'student', 'created_at']


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
