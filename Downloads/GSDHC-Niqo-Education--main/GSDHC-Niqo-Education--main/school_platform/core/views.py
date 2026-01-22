from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.db.models import Count, Q, Avg
from django.core.paginator import Paginator
from .models import SchoolYear, Level, Class, Student, Teacher, Subject
from .forms import SchoolYearForm, LevelForm, ClassForm, StudentForm, TeacherForm, SubjectForm, TermForm, TeacherAccountForm
from grades.models import Term


def is_admin(user):
    """
    Vérifie si l'utilisateur est un administrateur
    """
    return user.is_superuser or user.is_staff


@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    """
    Dashboard administrateur principal
    Vue d'ensemble du système scolaire avec statistiques et accès rapides
    """
    # Statistiques mockées (à remplacer par les vraies requêtes quand les modèles seront implémentés)
    stats = {
        'total_students': 0,  # Sera remplacé par Student.objects.filter(is_active=True).count()
        'total_classes': 0,   # Sera remplacé par Class.objects.filter(is_active=True).count()
        'total_teachers': 0,  # Sera remplacé par Teacher.objects.filter(is_active=True).count()
        'total_subjects': 0,  # Sera remplacé par Subject.objects.filter(is_active=True).count()
        'total_terms': 0,     # Sera remplacé par Term.objects.filter(is_active=True).count()
    }

    # Informations contextuelles
    context = {
        'stats': stats,
        'current_school_year': '2024-2025',  # Sera dynamique plus tard
        'page_title': 'Dashboard Administrateur',
        'user': request.user,
    }

    return render(request, 'dashboard/admin/dashboard.html', context)


@login_required
@user_passes_test(is_admin)
def generate_term_reports(request):
    """
    Vue pour la génération des bulletins trimestriels
    Interface préparatoire pour la génération PDF
    """
    if request.method == 'POST':
        # Logique de génération à implémenter plus tard
        messages.success(request, 'Génération des bulletins trimestriels lancée avec succès.')
        return redirect('admin_dashboard')

    context = {
        'page_title': 'Génération des bulletins trimestriels',
    }
    return render(request, 'dashboard/admin/generate_reports.html', context)


@login_required
@user_passes_test(is_admin)
def generate_annual_reports(request):
    """
    Vue pour la génération des bulletins annuels
    Interface préparatoire pour la génération PDF
    """
    if request.method == 'POST':
        # Logique de génération à implémenter plus tard
        messages.success(request, 'Génération des bulletins annuels lancée avec succès.')
        return redirect('admin_dashboard')

    context = {
        'page_title': 'Génération des bulletins annuels',
    }
    return render(request, 'dashboard/admin/generate_reports.html', context)


@login_required
@user_passes_test(is_admin)
def import_students(request):
    """
    Vue pour l'importation des données élèves via Excel
    Interface préparatoire pour l'import avec statistiques
    """
    # Statistiques pour les cards
    total_students = Student.objects.count()
    active_students = Student.objects.filter(is_active=True).count()
    students_with_class = Student.objects.filter(current_class__isnull=False).count()
    classes_count = Class.objects.filter(is_active=True).count()

    if request.method == 'POST':
        # Logique d'import à implémenter plus tard
        messages.success(request, 'Importation des élèves terminée avec succès.')
        return redirect('core:import_students')

    context = {
        'page_title': 'Import Élèves',
        'total_students': total_students,
        'active_students': active_students,
        'students_with_class': students_with_class,
        'classes_count': classes_count,
    }
    return render(request, 'dashboard/admin/import_students.html', context)


@login_required
@user_passes_test(is_admin)
def import_teachers(request):
    """
    Vue pour l'importation des données professeurs via Excel
    Interface préparatoire pour l'import avec statistiques
    """
    # Statistiques pour les cards
    total_teachers = Teacher.objects.count()
    active_teachers = Teacher.objects.filter(is_active=True).count()
    teachers_with_subjects = Teacher.objects.filter(subjects__isnull=False).distinct().count()
    subjects_count = Subject.objects.filter(is_active=True).count()

    if request.method == 'POST':
        # Logique d'import à implémenter plus tard
        messages.success(request, 'Importation des professeurs terminée avec succès.')
        return redirect('core:import_teachers')

    context = {
        'page_title': 'Import Professeurs',
        'total_teachers': total_teachers,
        'active_teachers': active_teachers,
        'teachers_with_subjects': teachers_with_subjects,
        'subjects_count': subjects_count,
    }
    return render(request, 'dashboard/admin/import_teachers.html', context)


@login_required
@user_passes_test(is_admin)
def classes_management(request):
    """
    Vue pour la gestion des classes
    Affiche un tableau des classes avec actions
    """
    # Récupérer toutes les classes avec relations
    classes = Class.objects.select_related('level', 'school_year', 'main_teacher').order_by('level__order', 'name')

    # Calculer les statistiques pour chaque classe
    for class_obj in classes:
        class_obj.students_count = Student.objects.filter(current_class=class_obj, is_active=True).count()

    # Statistiques pour les cartes
    total_classes = classes.count()
    active_classes = classes.filter(is_active=True).count()
    # Calculer la moyenne d'élèves par classe
    total_students = sum(class_obj.students_count for class_obj in classes.filter(is_active=True))
    avg_students = total_students // max(active_classes, 1)
    unique_levels = classes.filter(is_active=True).values('level').distinct().count()

    # Gestion des actions POST
    if request.method == 'POST':
        action = request.POST.get('action')
        class_id = request.POST.get('class_id')

        if action == 'delete' and class_id:
            try:
                class_obj = get_object_or_404(Class, pk=class_id)
                # Vérifier s'il y a des élèves associés
                if Student.objects.filter(current_class=class_obj, is_active=True).exists():
                    messages.error(request, f"Impossible de supprimer la classe {class_obj.name} car des élèves y sont inscrits.")
                else:
                    class_obj.delete()
                    messages.success(request, f"Classe {class_obj.name} supprimée avec succès.")
            except Class.DoesNotExist:
                messages.error(request, "Classe introuvable.")
            return redirect('core:list_classes')

    context = {
        'page_title': 'Gestion des classes',
        'classes': classes,
        'total_classes': total_classes,
        'active_classes': active_classes,
        'avg_students': avg_students,
        'unique_levels': unique_levels,
    }
    return render(request, 'dashboard/admin/classes.html', context)


@login_required
@user_passes_test(is_admin)
def report_templates(request):
    """
    Vue pour la gestion des templates de bulletins
    Liste des templates par type avec actions
    """
    # Données mockées - à remplacer par les vraies données quand les modèles seront implémentés
    templates_data = [
        {
            'name': 'Template CP',
            'type': 'Primaire',
            'level': 'CP',
            'description': 'Template standard pour les classes de CP',
            'last_modified': '2024-01-15',
            'status': 'active'
        },
        {
            'name': 'Template CE1/CE2',
            'type': 'Primaire',
            'level': 'CE1/CE2',
            'description': 'Template adapté pour CE1 et CE2',
            'last_modified': '2024-01-10',
            'status': 'active'
        },
        {
            'name': 'Template CM1/CM2',
            'type': 'Primaire',
            'level': 'CM1/CM2',
            'description': 'Template pour les classes de CM',
            'last_modified': '2024-01-08',
            'status': 'active'
        },
        {
            'name': 'Template Collège',
            'type': 'Collège',
            'level': '6ème-3ème',
            'description': 'Template officiel pour le collège',
            'last_modified': '2024-01-05',
            'status': 'active'
        },
        {
            'name': 'Template Lycée',
            'type': 'Lycée',
            'level': 'Seconde-Terminale',
            'description': 'Template pour le lycée général',
            'last_modified': '2024-01-01',
            'status': 'draft'
        },
    ]

    context = {
        'page_title': 'Templates de bulletins',
        'templates': templates_data,
    }
    return render(request, 'dashboard/admin/report_templates.html', context)


@login_required
@user_passes_test(is_admin)
def levels_management(request):
    """
    Vue pour la gestion des niveaux scolaires
    Affiche un tableau des niveaux avec actions
    """
    # Récupérer tous les niveaux
    levels = Level.objects.order_by('order')

    # Calculer les statistiques pour chaque niveau
    for level in levels:
        level.classes_count = Class.objects.filter(level=level, is_active=True).count()
        level.students_count = Student.objects.filter(current_class__level=level, is_active=True).count()
        # Pour les matières, on compte combien de matières sont utilisées dans ce niveau
        # Comme il n'y a pas de relation directe, on peut compter via les classes
        level.subjects_count = 0  # Temporairement à 0

    # Statistiques pour les cartes
    total_classes = sum(level.classes_count for level in levels)
    total_students = sum(level.students_count for level in levels)
    total_subjects = sum(level.subjects_count for level in levels)

    # Gestion des actions POST
    if request.method == 'POST':
        action = request.POST.get('action')
        level_id = request.POST.get('level_id')

        if action == 'delete' and level_id:
            try:
                level = get_object_or_404(Level, pk=level_id)
                # Vérifier s'il y a des classes associées
                if Class.objects.filter(level=level, is_active=True).exists():
                    messages.error(request, f"Impossible de supprimer le niveau {level.name} car des classes y sont associées.")
                else:
                    level.delete()
                    messages.success(request, f"Niveau {level.name} supprimé avec succès.")
            except Level.DoesNotExist:
                messages.error(request, "Niveau introuvable.")
            return redirect('core:levels_management')

    context = {
        'page_title': 'Gestion des niveaux',
        'levels': levels,
        'total_levels': levels.count(),
        'total_classes': total_classes,
        'total_students': total_students,
        'total_subjects': total_subjects,
    }
    return render(request, 'dashboard/admin/levels.html', context)


@login_required
@user_passes_test(is_admin)
def students_management(request):
    """
    Vue pour la gestion des élèves
    Affiche un tableau des élèves avec actions
    """
    # Récupérer tous les élèves avec relations
    students = Student.objects.select_related('current_class__level').order_by(
        'current_class__level__name', 'last_name', 'first_name'
    )

    # Statistiques pour les cartes
    total_students = students.count()
    active_students = students.filter(is_active=True).count()
    boys_count = students.filter(gender='M', is_active=True).count()
    girls_count = students.filter(gender='F', is_active=True).count()

    # Pagination
    paginator = Paginator(students, 25)  # 25 élèves par page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Gestion des actions POST
    if request.method == 'POST':
        action = request.POST.get('action')
        student_id = request.POST.get('student_id')

        if action == 'delete' and student_id:
            try:
                student = get_object_or_404(Student, pk=student_id)
                student.delete()
                messages.success(request, f"Élève {student.first_name} {student.last_name} supprimé avec succès.")
            except Student.DoesNotExist:
                messages.error(request, "Élève introuvable.")
            return redirect('core:students_management')

    context = {
        'page_title': 'Gestion des élèves',
        'students': page_obj,
        'total_students': total_students,
        'active_students': active_students,
        'boys_count': boys_count,
        'girls_count': girls_count,
    }
    return render(request, 'dashboard/admin/students.html', context)


@login_required
@user_passes_test(is_admin)
def teachers_management(request):
    """
    Vue pour la gestion des professeurs
    Affiche un tableau des professeurs avec actions
    """
    # Récupérer tous les professeurs avec relations
    teachers = Teacher.objects.prefetch_related('subjects').order_by('last_name', 'first_name')

    # Calculer les statistiques pour chaque professeur
    for teacher in teachers:
        teacher.classes_count = Class.objects.filter(main_teacher=teacher, is_active=True).count()
        teacher.subjects_count = teacher.subjects.count()

    # Statistiques pour les cartes
    total_teachers = teachers.count()
    active_teachers = teachers.filter(is_active=True).count()
    classes_count = Class.objects.filter(main_teacher__is_active=True, is_active=True).count()
    total_subjects = sum(teacher.subjects_count for teacher in teachers.filter(is_active=True))
    avg_subjects = total_subjects // max(active_teachers, 1)

    # Pagination
    paginator = Paginator(teachers, 20)  # 20 professeurs par page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Gestion des actions POST
    if request.method == 'POST':
        action = request.POST.get('action')
        teacher_id = request.POST.get('teacher_id')

        if action == 'delete' and teacher_id:
            try:
                teacher = get_object_or_404(Teacher, pk=teacher_id)
                # Vérifier s'il y a des classes associées
                if Class.objects.filter(main_teacher=teacher, is_active=True).exists():
                    messages.error(request, f"Impossible de supprimer {teacher.first_name} {teacher.last_name} car il/elle est professeur principal de classe(s).")
                else:
                    teacher.is_active = False  # Soft delete
                    teacher.save()
                    messages.success(request, f"Professeur {teacher.first_name} {teacher.last_name} désactivé avec succès.")
            except Teacher.DoesNotExist:
                messages.error(request, "Professeur introuvable.")
            return redirect('core:teachers_management')

    context = {
        'page_title': 'Gestion des professeurs',
        'teachers': page_obj,
        'total_teachers': total_teachers,
        'active_teachers': active_teachers,
        'classes_count': classes_count,
        'avg_subjects': avg_subjects,
    }
    return render(request, 'dashboard/admin/teachers.html', context)


@login_required
@user_passes_test(is_admin)
def subjects_management(request):
    """
    Vue pour la gestion des matières
    Affiche un tableau des matières avec actions
    """
    # Récupérer toutes les matières
    subjects = Subject.objects.order_by('name')

    # Calculer les statistiques pour chaque matière
    for subject in subjects:
        subject.teachers_count = Teacher.objects.filter(subjects=subject, is_active=True).count()
        # Pour les niveaux, comme il n'y a pas de relation directe, on peut compter via les classes
        # ou simplement mettre 0 pour l'instant
        subject.levels_count = 0  # Temporairement à 0

    # Statistiques pour les cartes
    total_subjects = subjects.count()
    active_subjects = subjects.filter(is_active=True).count()
    teachers_count = Teacher.objects.filter(subjects__is_active=True, is_active=True).distinct().count()
    total_coefficients = sum(subject.coefficient for subject in subjects.filter(is_active=True))
    avg_coefficient = total_coefficients // max(active_subjects, 1)

    # Calculer les niveaux couverts (approximation)
    levels_covered = 0  # Pour l'instant, on met une valeur fixe ou on calcule différemment

    # Gestion des actions POST
    if request.method == 'POST':
        action = request.POST.get('action')
        subject_id = request.POST.get('subject_id')

        if action == 'delete' and subject_id:
            try:
                subject = get_object_or_404(Subject, pk=subject_id)
                # Vérifier s'il y a des professeurs associés
                if Teacher.objects.filter(subjects=subject, is_active=True).exists():
                    messages.error(request, f"Impossible de supprimer la matière {subject.name} car des professeurs l'enseignent.")
                else:
                    subject.delete()
                    messages.success(request, f"Matière {subject.name} supprimée avec succès.")
            except Subject.DoesNotExist:
                messages.error(request, "Matière introuvable.")
            return redirect('core:subjects_management')

    context = {
        'page_title': 'Gestion des matières',
        'subjects': subjects,
        'total_subjects': total_subjects,
        'active_subjects': active_subjects,
        'teachers_count': teachers_count,
        'levels_covered': levels_covered,
        'avg_coefficient': avg_coefficient,
    }
    return render(request, 'dashboard/admin/subjects.html', context)


@login_required
@user_passes_test(is_admin)
def add_school_year(request):
    """
    Vue pour ajouter une nouvelle année scolaire
    """
    if request.method == 'POST':
        form = SchoolYearForm(request.POST)
        if form.is_valid():
            school_year = form.save()
            messages.success(request, f"Année scolaire {school_year.name} créée avec succès.")
            return redirect('core:school_years_management')
        else:
            messages.error(request, "Veuillez corriger les erreurs dans le formulaire.")
    else:
        form = SchoolYearForm()

    context = {
        'page_title': 'Ajouter une année scolaire',
        'form': form,
    }
    return render(request, 'dashboard/admin/add_school_year.html', context)


@login_required
@user_passes_test(is_admin)
def add_term(request):
    """
    Vue pour ajouter un nouveau trimestre
    """
    if request.method == 'POST':
        form = TermForm(request.POST)
        if form.is_valid():
            term = form.save()
            messages.success(request, f"Trimestre {term.get_name_display()} ({term.school_year.name}) créé avec succès.")
            return redirect(reverse('core:terms_management') + f'?year={term.school_year.pk}')
        else:
            messages.error(request, "Veuillez corriger les erreurs dans le formulaire.")
    else:
        form = TermForm()

    context = {
        'page_title': 'Ajouter un trimestre',
        'form': form,
    }
    return render(request, 'dashboard/admin/add_term.html', context)


@login_required
@user_passes_test(is_admin)
def teacher_accounts_management(request):
    """
    Vue pour la gestion des comptes professeurs principaux
    Permet de gérer les comptes utilisateurs des professeurs
    """
    # Récupérer tous les professeurs avec leurs comptes utilisateurs
    teachers = Teacher.objects.select_related('user').order_by('last_name', 'first_name')

    # Statistiques
    total_teachers = teachers.count()
    teachers_with_accounts = teachers.filter(user__isnull=False).count()
    active_accounts = teachers.filter(user__isnull=False, user__is_active=True).count()

    # Gestion des actions POST
    if request.method == 'POST':
        action = request.POST.get('action')
        teacher_id = request.POST.get('teacher_id')

        if action == 'create_account' and teacher_id:
            try:
                teacher = get_object_or_404(Teacher, pk=teacher_id)
                if teacher.user:
                    messages.warning(request, f"Le professeur {teacher.first_name} {teacher.last_name} a déjà un compte.")
                else:
                    # Créer un compte utilisateur pour le professeur
                    from django.contrib.auth.models import User
                    username = f"{teacher.first_name.lower()}.{teacher.last_name.lower()}"
                    base_username = username
                    counter = 1

                    # S'assurer que le nom d'utilisateur est unique
                    while User.objects.filter(username=username).exists():
                        username = f"{base_username}{counter}"
                        counter += 1

                    # Créer l'utilisateur avec un mot de passe temporaire
                    temp_password = "Temp123!"  # À changer par l'utilisateur
                    user = User.objects.create_user(
                        username=username,
                        email=teacher.email,
                        password=temp_password,
                        first_name=teacher.first_name,
                        last_name=teacher.last_name,
                        is_staff=False,  # Les professeurs ne sont pas staff par défaut
                        is_active=True
                    )

                    # Associer l'utilisateur au professeur
                    teacher.user = user
                    teacher.save()

                    messages.success(request, f"Compte créé pour {teacher.first_name} {teacher.last_name}. Nom d'utilisateur: {username}, Mot de passe temporaire: {temp_password}")

            except Teacher.DoesNotExist:
                messages.error(request, "Professeur introuvable.")
            return redirect('core:teacher_accounts_management')

        elif action == 'toggle_account' and teacher_id:
            try:
                teacher = get_object_or_404(Teacher, pk=teacher_id)
                if teacher.user:
                    teacher.user.is_active = not teacher.user.is_active
                    teacher.user.save()
                    status = "activé" if teacher.user.is_active else "désactivé"
                    messages.success(request, f"Compte de {teacher.first_name} {teacher.last_name} {status}.")
                else:
                    messages.error(request, "Ce professeur n'a pas de compte.")
            except Teacher.DoesNotExist:
                messages.error(request, "Professeur introuvable.")
            return redirect('core:teacher_accounts_management')

        elif action == 'reset_password' and teacher_id:
            try:
                teacher = get_object_or_404(Teacher, pk=teacher_id)
                if teacher.user:
                    # Réinitialiser le mot de passe
                    temp_password = "Temp123!"
                    teacher.user.set_password(temp_password)
                    teacher.user.save()
                    messages.success(request, f"Mot de passe réinitialisé pour {teacher.first_name} {teacher.last_name}. Nouveau mot de passe: {temp_password}")
                else:
                    messages.error(request, "Ce professeur n'a pas de compte.")
            except Teacher.DoesNotExist:
                messages.error(request, "Professeur introuvable.")
            return redirect('core:teacher_accounts_management')

    # Statistiques supplémentaires
    teachers_without_accounts = total_teachers - teachers_with_accounts

    context = {
        'page_title': 'Comptes professeurs principaux',
        'teachers': teachers,
        'total_teachers': total_teachers,
        'teachers_with_accounts': teachers_with_accounts,
        'active_accounts': active_accounts,
        'teachers_without_accounts': teachers_without_accounts,
    }
    return render(request, 'dashboard/admin/teacher_accounts.html', context)


@login_required
@user_passes_test(is_admin)
def add_level(request):
    """
    Vue pour ajouter un nouveau niveau scolaire
    """
    if request.method == 'POST':
        form = LevelForm(request.POST)
        if form.is_valid():
            level = form.save()
            messages.success(request, f"Niveau '{level.name}' créé avec succès.")
            return redirect('core:levels_management')
    else:
        form = LevelForm()

    context = {
        'page_title': 'Ajouter un niveau',
        'form': form,
    }
    return render(request, 'dashboard/admin/add_level.html', context)


@login_required
@user_passes_test(is_admin)
def add_class(request):
    """
    Vue pour ajouter une nouvelle classe
    """
    if request.method == 'POST':
        form = ClassForm(request.POST)
        if form.is_valid():
            classe = form.save()
            messages.success(request, f"Classe {classe.name} créée avec succès.")
            return redirect('core:classes_management')
    else:
        form = ClassForm()

    context = {
        'page_title': 'Ajouter une classe',
        'form': form,
        'classes': Class.objects.select_related('level', 'school_year', 'main_teacher').order_by('level__order', 'name')[:5] if Class else [],
        'levels': Level.objects.all().order_by('order') if Level else [],
    }
    return render(request, 'dashboard/admin/add_class.html', context)


@login_required
@user_passes_test(is_admin)
def add_student(request):
    """
    Vue pour ajouter un nouvel élève
    """
    if request.method == 'POST':
        form = StudentForm(request.POST)
        if form.is_valid():
            student = form.save()
            messages.success(request, f"Élève {student.first_name} {student.last_name} inscrit avec succès.")
            return redirect('core:students_management')
    else:
        form = StudentForm()

    context = {
        'page_title': 'Ajouter un élève',
        'form': form,
    }
    return render(request, 'dashboard/admin/add_student.html', context)


@login_required
@user_passes_test(is_admin)
def add_teacher(request):
    """
    Vue pour ajouter un nouveau professeur
    """
    if request.method == 'POST':
        form = TeacherForm(request.POST)
        if form.is_valid():
            teacher = form.save()
            messages.success(request, f"Professeur {teacher.first_name} {teacher.last_name} recruté avec succès.")
            return redirect('core:teachers_management')
    else:
        form = TeacherForm()

    context = {
        'page_title': 'Ajouter un professeur',
        'form': form,
    }
    return render(request, 'dashboard/admin/add_teacher.html', context)


@login_required
@user_passes_test(is_admin)
def add_subject(request):
    """
    Vue pour ajouter une nouvelle matière
    """
    if request.method == 'POST':
        form = SubjectForm(request.POST)
        if form.is_valid():
            subject = form.save()
            messages.success(request, f"Matière '{subject.name}' créée avec succès.")
            return redirect('core:subjects_management')
    else:
        form = SubjectForm()

    context = {
        'page_title': 'Ajouter une matière',
        'form': form,
    }
    return render(request, 'dashboard/admin/add_subject.html', context)


@login_required
@user_passes_test(is_admin)
def school_years_management(request):
    """
    Vue pour la gestion des années scolaires
    Liste des années scolaires avec création/activation/clôture
    """
    school_years = SchoolYear.objects.order_by('-start_date')

    # Calculer les statistiques pour chaque année scolaire
    for school_year in school_years:
        school_year.classes_count = Class.objects.filter(school_year=school_year).count()
        school_year.students_count = Student.objects.filter(current_class__school_year=school_year).count()
        school_year.terms_count = Term.objects.filter(school_year=school_year).count()

    # Gestion des actions POST
    if request.method == 'POST':
        action = request.POST.get('action')
        year_id = request.POST.get('year_id')

        if action == 'activate' and year_id:
            try:
                school_year = get_object_or_404(SchoolYear, pk=year_id)
                if not school_year.is_active:
                    # Désactiver l'année actuelle si elle existe
                    SchoolYear.objects.filter(is_active=True).update(is_active=False)
                    school_year.is_active = True
                    school_year.save()
                    messages.success(request, f'Année scolaire {school_year.name} activée avec succès.')
                else:
                    messages.info(request, f'L\'année scolaire {school_year.name} est déjà active.')
            except SchoolYear.DoesNotExist:
                messages.error(request, 'Année scolaire introuvable.')
            return redirect('core:school_years_management')

    # Statistiques pour les cartes
    total_years = school_years.count()
    active_year = school_years.filter(is_active=True).first()
    total_classes = active_year.classes_count if active_year else 0
    total_students = active_year.students_count if active_year else 0

    context = {
        'page_title': 'Gestion des années scolaires',
        'school_years': school_years,
        'total_years': total_years,
        'active_year_exists': active_year is not None,
        'total_classes': total_classes,
        'total_students': total_students,
    }
    return render(request, 'dashboard/admin/school_years.html', context)


@login_required
@user_passes_test(is_admin)
def terms_management(request):
    """
    Vue pour la gestion des trimestres scolaires
    Sélecteur d'année scolaire avec création des trimestres
    """
    selected_year_id = request.GET.get('year')
    school_years = SchoolYear.objects.all().order_by('-name')
    current_school_year = None
    terms = []

    if selected_year_id:
        current_school_year = get_object_or_404(SchoolYear, pk=selected_year_id)
    else:
        # Sélectionner l'année actuelle par défaut, sinon la plus récente
        current_school_year = SchoolYear.objects.filter(is_active=True).first()
        if not current_school_year and school_years.exists():
            current_school_year = school_years.first()

    if current_school_year:
        terms = Term.objects.filter(school_year=current_school_year).order_by('start_date')

    # Gestion des actions POST
    if request.method == 'POST':
        action = request.POST.get('action')
        term_id = request.POST.get('term_id')

        if action == 'close' and term_id:
            try:
                term = get_object_or_404(Term, pk=term_id)
                if not term.is_closed:
                    term.is_active = False
                    term.is_closed = True
                    term.save()
                    messages.success(request, f'Trimestre {term.get_name_display()} ({term.school_year.name}) clôturé avec succès.')
                else:
                    messages.info(request, f'Le trimestre {term.get_name_display()} est déjà clôturé.')
            except Term.DoesNotExist:
                messages.error(request, 'Trimestre introuvable.')
            return redirect(f'{reverse("core:terms_management")}?year={current_school_year.pk if current_school_year else ""}')

    # Statistiques pour les cartes
    total_terms = terms.count() if terms else 0
    active_term = terms.filter(is_active=True, is_closed=False).first() if terms else None
    active_term_exists = active_term is not None

    context = {
        'page_title': 'Gestion des trimestres',
        'school_years': school_years,
        'current_school_year': current_school_year,
        'terms': terms,
        'total_terms': total_terms,
        'active_term_exists': active_term_exists,
    }
    return render(request, 'dashboard/admin/terms.html', context)


@login_required
@user_passes_test(is_admin)
def add_teacher_account(request):
    """
    Vue pour créer un compte utilisateur pour un professeur
    """

    if request.method == 'POST':
        form = TeacherAccountForm(request.POST)
        if form.is_valid():
            teacher = form.cleaned_data['teacher']
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            role = form.cleaned_data['role']
            status = form.cleaned_data['status']

            # Créer l'utilisateur
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=teacher.first_name,
                last_name=teacher.last_name,
                is_active=(status == 'active')
            )

            # Associer l'utilisateur au professeur
            teacher.user = user
            teacher.save()

            # Assigner le groupe selon le rôle
            if role == 'admin':
                admin_group, created = Group.objects.get_or_create(name='Administrators')
                user.groups.add(admin_group)
                user.is_staff = True
                user.is_superuser = True
                user.save()
            elif role == 'head_teacher':
                head_group, created = Group.objects.get_or_create(name='Head Teachers')
                user.groups.add(head_group)
                user.is_staff = True
                user.save()
            else:  # teacher (PROFESSEUR_PRINCIPAL)
                professeur_principal_group = Group.objects.get(name='PROFESSEUR_PRINCIPAL')
                user.groups.add(professeur_principal_group)
                user.is_staff = True
                user.save()

            messages.success(
                request,
                f"Compte créé avec succès pour {teacher.first_name} {teacher.last_name}. "
                f"Nom d'utilisateur: {username}"
            )
            return redirect('core:teacher_accounts_management')
    else:
        form = TeacherAccountForm()

    context = {
        'form': form,
        'teachers': Teacher.objects.filter(user__isnull=True, is_active=True).order_by('last_name', 'first_name'),
    }
    return render(request, 'dashboard/admin/add_teacher_account.html', context)
