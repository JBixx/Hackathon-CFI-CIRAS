from django.contrib import admin
from .models import Term, Grade, ReportCard, SubjectGrade


@admin.register(Term)
class TermAdmin(admin.ModelAdmin):
    list_display = ['name', 'school_year', 'number', 'start_date', 'end_date', 'is_active']
    list_filter = ['school_year', 'number', 'is_active']
    search_fields = ['name']
    ordering = ['school_year', 'number']


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ['student', 'subject', 'value', 'max_points', 'grade_type', 'term', 'date', 'teacher']
    list_filter = ['grade_type', 'term', 'subject', 'teacher', 'date']
    search_fields = ['student__first_name', 'student__last_name', 'student__matricule']
    ordering = ['-date']

    fieldsets = (
        ('Informations générales', {
            'fields': ('student', 'subject', 'teacher', 'term')
        }),
        ('Détails de la note', {
            'fields': ('grade_type', 'value', 'max_points', 'coefficient', 'date', 'description')
        }),
    )


@admin.register(ReportCard)
class ReportCardAdmin(admin.ModelAdmin):
    list_display = ['student', 'school_year', 'term', 'report_type', 'general_average', 'class_ranking', 'generated_at', 'is_final']
    list_filter = ['report_type', 'school_year', 'term', 'is_final']
    search_fields = ['student__first_name', 'student__last_name', 'student__matricule']
    ordering = ['-generated_at']

    fieldsets = (
        ('Informations générales', {
            'fields': ('student', 'school_year', 'term', 'report_type')
        }),
        ('Résultats', {
            'fields': ('general_average', 'class_ranking', 'class_size')
        }),
        ('Appréciations', {
            'fields': ('teacher_comments', 'director_comments')
        }),
        ('Statut', {
            'fields': ('is_final',)
        }),
    )


@admin.register(SubjectGrade)
class SubjectGradeAdmin(admin.ModelAdmin):
    list_display = ['report_card', 'subject', 'average', 'coefficient', 'teacher']
    list_filter = ['subject', 'teacher']
    search_fields = ['report_card__student__first_name', 'report_card__student__last_name', 'subject__name']
    ordering = ['report_card', 'subject']

    fieldsets = (
        ('Informations générales', {
            'fields': ('report_card', 'subject', 'teacher')
        }),
        ('Résultats', {
            'fields': ('average', 'coefficient', 'appreciation')
        }),
    )
