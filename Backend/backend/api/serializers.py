from rest_framework import serializers
from .models import User, Complaint, Feedback, Department, DepartmentPointTransaction


class departmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'reward_points', 'college']
        read_only_fields = ['id']


class StudentGridSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'department',
            'is_active',
            'password',
            'role',
            'roll_no',
            'college_name',
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        
        user = User(**validated_data)
        user.set_password(password)   # 🔥 important
        user.save()

        return user
    

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'complaint', 'rating', 'review_text']
        read_only_fields = ['id', 'complaint']


class ComplaintSerializer(serializers.ModelSerializer):
    assigned_department = serializers.StringRelatedField()
    image = serializers.ImageField(max_length=None, use_url=True)
    feedback = FeedbackSerializer(read_only=True)
    roll_no = serializers.CharField(source='student.roll_no', read_only=True)
    class Meta:
        model = Complaint
        fields = ['id', 'student', 'image', 'description', 'assigned_department', 'status', 'created_at', 'resolved_at', 'priority', 'title', 'feedback', 'roll_no']
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
