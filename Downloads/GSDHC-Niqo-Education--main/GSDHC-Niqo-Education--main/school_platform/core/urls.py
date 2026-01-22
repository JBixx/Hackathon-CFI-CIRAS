from django.urls import path
from . import views, views_professeur, views_auth

app_name = 'core'

urlpatterns = [
    # Dashboard principal
    path('', views.admin_dashboard, name='admin_dashboard'),

    # Génération de bulletins
    path('reports/term/', views.generate_term_reports, name='generate_term_reports'),
    path('reports/annual/', views.generate_annual_reports, name='generate_annual_reports'),

    # Import de données
    path('import/students/', views.import_students, name='import_students'),
    path('import/teachers/', views.import_teachers, name='import_teachers'),

    # Gestion des classes
    path('classes/', views.classes_management, name='classes_management'),

    # Templates de bulletins
    path('templates/', views.report_templates, name='report_templates'),

    # Gestion des niveaux
    path('levels/', views.levels_management, name='levels_management'),

    # Gestion des élèves
    path('students/', views.students_management, name='students_management'),

    # Gestion des professeurs
    path('teachers/', views.teachers_management, name='teachers_management'),

    # Gestion des matières
    path('subjects/', views.subjects_management, name='subjects_management'),

    # Comptes professeurs principaux
    path('teacher_accounts/', views.teacher_accounts_management, name='teacher_accounts_management'),
    path('teacher_accounts/add/', views.add_teacher_account, name='add_teacher_account'),

    # Ajout d'éléments
    path('levels/add/', views.add_level, name='add_level'),
    path('classes/add/', views.add_class, name='add_class'),
    path('students/add/', views.add_student, name='add_student'),
    path('teachers/add/', views.add_teacher, name='add_teacher'),
    path('subjects/add/', views.add_subject, name='add_subject'),

    # Organisation scolaire
    path('school-years/', views.school_years_management, name='school_years_management'),
    path('school-years/add/', views.add_school_year, name='add_school_year'),
    path('terms/', views.terms_management, name='terms_management'),
    path('terms/add/', views.add_term, name='add_term'),

    # Authentification personnalisée
    path('login/', views_auth.custom_login, name='login'),
    path('logout/', views_auth.custom_logout, name='logout'),

    # URLs pour les professeurs principaux
    path('professeur/dashboard/', views_professeur.professeur_dashboard, name='professeur_dashboard'),
    path('professeur/classes/', views_professeur.professeur_classes, name='professeur_classes'),
    path('professeur/classes/<int:class_id>/', views_professeur.professeur_class_detail, name='professeur_class_detail'),
    path('professeur/grades/', views_professeur.professeur_grades, name='professeur_grades'),
    path('professeur/reports/', views_professeur.professeur_reports, name='professeur_reports'),
    path('professeur/profile/', views_professeur.professeur_profile, name='professeur_profile'),
]
