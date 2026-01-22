from django.contrib import admin
from .models import SchoolYear, Level, Subject, Teacher, Class, Student


@admin.register(SchoolYear)
class SchoolYearAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_date', 'end_date', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']
    ordering = ['-start_date']


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'order']
    search_fields = ['name', 'code']
    ordering = ['order']


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'coefficient', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'code']
    ordering = ['name']


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['last_name', 'first_name', 'matricule', 'email', 'is_active']
    list_filter = ['is_active', 'subjects']
    search_fields = ['first_name', 'last_name', 'matricule', 'email']
    filter_horizontal = ['subjects']
    ordering = ['last_name', 'first_name']


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ['name', 'level', 'school_year', 'main_teacher', 'current_students_count', 'capacity', 'is_active']
    list_filter = ['level', 'school_year', 'is_active']
    search_fields = ['name']
    ordering = ['level__order', 'name']


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['last_name', 'first_name', 'matricule', 'current_class', 'gender', 'is_active']
    list_filter = ['gender', 'is_active', 'current_class__level', 'current_class__school_year']
    search_fields = ['first_name', 'last_name', 'matricule']
    ordering = ['last_name', 'first_name']

    fieldsets = (
        ('Informations personnelles', {
            'fields': ('matricule', 'first_name', 'last_name', 'gender', 'birth_date', 'birth_place', 'address', 'phone', 'email')
        }),
        ('Informations scolaires', {
            'fields': ('current_class', 'enrollment_date', 'is_active')
        }),
        ('Informations parentales', {
            'fields': ('father_name', 'mother_name', 'parent_phone', 'parent_email')
        }),
    )
