from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Count, Q
from django.utils import timezone

from .decorators import professeur_principal_required, filter_by_assigned_classes
from .models import Class, Student, Teacher, Subject


@login_required
@professeur_principal_required
@filter_by_assigned_classes
def professeur_dashboard(request):
    """
    Dashboard personnalisé pour les professeurs principaux
    """
    assigned_classes = request.assigned_classes
    assigned_class_ids = request.assigned_class_ids

    # Statistiques des classes assignées
    total_classes = len(assigned_classes)
    total_students = Student.objects.filter(
        current_class_id__in=assigned_class_ids,
        is_active=True
    ).count()

    # Classes avec leurs statistiques
    classes_with_students = []
    for class_obj in assigned_classes:
        students_in_class = Student.objects.filter(
            current_class=class_obj,
            is_active=True
        )
        student_count = students_in_class.count()
        boys_count = students_in_class.filter(gender='M').count()
        girls_count = students_in_class.filter(gender='F').count()

        classes_with_students.append({
            'class': class_obj,
            'student_count': student_count,
            'boys_count': boys_count,
            'girls_count': girls_count,
        })

    # Trier par nombre d'élèves (décroissant)
    classes_with_students.sort(key=lambda x: x['student_count'], reverse=True)

    context = {
        'page_title': 'Dashboard',
        'total_classes': total_classes,
        'total_students': total_students,
        'classes_with_students': classes_with_students[:5],  # Top 5
        'assigned_classes': assigned_classes,
    }

    return render(request, 'professeur/dashboard.html', context)


@login_required
@professeur_principal_required
@filter_by_assigned_classes
def professeur_classes(request):
    """
    Gestion des classes assignées au professeur principal
    """
    assigned_classes = request.assigned_classes

    # Statistiques détaillées pour chaque classe
    classes_data = []
    for class_obj in assigned_classes:
        students = Student.objects.filter(
            current_class=class_obj,
            is_active=True
        ).select_related('current_class')

        # Répartition par genre
        boys_count = students.filter(gender='M').count()
        girls_count = students.filter(gender='F').count()

        classes_data.append({
            'class': class_obj,
            'total_students': students.count(),
            'boys_count': boys_count,
            'girls_count': girls_count,
            'students': students.order_by('last_name', 'first_name'),
        })

    context = {
        'page_title': 'Mes classes',
        'classes_data': classes_data,
        'assigned_classes': assigned_classes,
    }

    return render(request, 'professeur/classes.html', context)


@login_required
@professeur_principal_required
@filter_by_assigned_classes
def professeur_class_detail(request, class_id):
    """
    Détail d'une classe spécifique
    """
    assigned_class_ids = request.assigned_class_ids

    # Vérifier que la classe est assignée à ce professeur
    if class_id not in assigned_class_ids:
        messages.error(request, "Vous n'avez pas accès à cette classe.")
        return redirect('core:professeur_classes')

    class_obj = get_object_or_404(Class, id=class_id, is_active=True)
    students = Student.objects.filter(
        current_class=class_obj,
        is_active=True
    ).order_by('last_name', 'first_name')

    context = {
        'page_title': f'Classe {class_obj.name}',
        'class_obj': class_obj,
        'students': students,
    }

    return render(request, 'professeur/class_detail.html', context)


@login_required
@professeur_principal_required
@filter_by_assigned_classes
def professeur_grades(request):
    """
    Gestion des notes et moyennes pour les classes assignées
    """
    assigned_classes = request.assigned_classes

    context = {
        'page_title': 'Notes & moyennes',
        'assigned_classes': assigned_classes,
    }

    return render(request, 'professeur/grades.html', context)


@login_required
@professeur_principal_required
@filter_by_assigned_classes
def professeur_reports(request):
    """
    Gestion des bulletins pour les classes assignées
    """
    assigned_classes = request.assigned_classes

    context = {
        'page_title': 'Bulletins',
        'assigned_classes': assigned_classes,
    }

    return render(request, 'professeur/reports.html', context)


@login_required
@professeur_principal_required
def professeur_profile(request):
    """
    Profil du professeur principal
    """
    teacher = request.user.teacher

    # Statistiques personnelles
    assigned_classes = Class.objects.filter(
        main_teacher=teacher,
        is_active=True
    )

    total_students = Student.objects.filter(
        current_class__in=assigned_classes,
        is_active=True
    ).count()

    context = {
        'page_title': 'Mon compte',
        'teacher': teacher,
        'assigned_classes': assigned_classes,
        'total_students': total_students,
    }

    return render(request, 'professeur/profile.html', context)
