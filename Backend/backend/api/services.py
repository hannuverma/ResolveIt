from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from django.utils import timezone
from django.db.models import F
import math
from .models import DepartmentPointTransaction, Complaint
import requests
from django.conf import settings
from django.db.models import Avg


def get_group_average_rating(complaint):
    if not complaint.similarity_hash:
        return None

    avg_rating = (
        Complaint.objects
        .filter(
            similarity_hash=complaint.similarity_hash,
            assigned_department=complaint.assigned_department,
            feedback__isnull=False
        )
        .aggregate(avg=Avg('feedback__rating'))
    )['avg']

    return avg_rating


@transaction.atomic
def add_department_points(department, complaint, points, transaction_type):
    if complaint:
        exists = DepartmentPointTransaction.objects.filter(
            department=department,
            complaint=complaint,
            transaction_type=transaction_type
        ).exists()

        if exists:
            return

    department.reward_points = F('reward_points') + points
    department.save()
    department.refresh_from_db()

    DepartmentPointTransaction.objects.create(
        department=department,
        complaint=complaint,
        points=points,
        transaction_type=transaction_type
    )

def handle_review_points(complaint):
    try:
        feedback = complaint.feedback
    except:
        return

    # If complaint is part of a group (has similarity_hash), skip individual points
    # Group review will be handled by handle_group_review_points()
    if complaint.similarity_hash:
        return

    rating = feedback.rating
    department = complaint.assigned_department
    if not department:
        return

    rating_points = {
        5: 20,
        4: 15,
        3: 5,
        2: -10,
        1: -20
    }

    if rating in rating_points:
        add_department_points(
            department=department,
            complaint=complaint,
            points=rating_points[rating],
            transaction_type="REVIEW"
        )


def handle_speed_bonus(complaint):

    if not complaint.resolved_at:
        return

    department = complaint.assigned_department
    time_taken = complaint.resolved_at - complaint.created_at

    if time_taken <= timedelta(hours=24):
        add_department_points(
            department=department,
            complaint=complaint,
            points=10,
            transaction_type="SPEED"
        )

def handle_unresolved_penalty(complaint):

    if complaint.status == Complaint.Status.RESOLVED:
        return

    department = complaint.assigned_department
    if not department:
        return

    days_open = (timezone.now() - complaint.created_at).days

    if days_open <= 0:
        return

    # Define penalty intervals
    penalty_rules = {
        "HIGH": 1,
        "MEDIUM": 2,
        "LOW": 3
    }

    interval = penalty_rules.get(complaint.priority)

    if not interval:
        return

    expected_penalty_days = days_open // interval

    # Get already penalized days
    already_penalized = DepartmentPointTransaction.objects.filter(
        complaint=complaint,
        transaction_type="PENALTY"
    ).count()

    new_penalties = expected_penalty_days - already_penalized

    if new_penalties <= 0:
        return

    for i in range(new_penalties):
        DepartmentPointTransaction.objects.create(
            department=department,
            complaint=complaint,
            points=-5,
            transaction_type="PENALTY"
        )

        department.reward_points = F('reward_points') - 5
        department.save()

    department.refresh_from_db()

def apply_unresolved_penalties():
    complaints = Complaint.objects.exclude(
        status=Complaint.Status.RESOLVED
    )

    for complaint in complaints:
        handle_unresolved_penalty(complaint)

def process_complaint_rating(complaint):

    handle_speed_bonus(complaint)
    # Handle grouped review aggregation (same similarity_hash)
    try:
        handle_group_review_points(complaint)
    except Exception:
        pass


@transaction.atomic
def handle_group_review_points(complaint):
    sim_hash = complaint.similarity_hash
    department = complaint.assigned_department

    if not sim_hash or not department:
        return

    avg_rating = (
        Complaint.objects
        .filter(
            similarity_hash=sim_hash,
            assigned_department=department,
            feedback__isnull=False
        )
        .aggregate(avg=Avg('feedback__rating'))
    )['avg']

    if avg_rating is None:
        return

    rounded = round(avg_rating)

    rating_points = {
        5: 20,
        4: 15,
        3: 5,
        2: -10,
        1: -20
    }

    new_points = rating_points.get(rounded, 0)

    tx = DepartmentPointTransaction.objects.filter(
        department=department,
        transaction_type="REVIEW",
        complaint__similarity_hash=sim_hash
    ).first()

    if tx:
        delta = new_points - tx.points
        if delta == 0:
            return

        tx.points = new_points
        tx.complaint = complaint
        tx.save()

        department.reward_points = F('reward_points') + delta
        department.save(update_fields=['reward_points'])

    else:
        DepartmentPointTransaction.objects.create(
            department=department,
            complaint=complaint,
            points=new_points,
            transaction_type="REVIEW"
        )
        department.reward_points = F('reward_points') + new_points
        department.save(update_fields=['reward_points'])