from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import SchoolYear, Level, Class, Student, Teacher, Subject
from grades.models import Term


class SchoolYearForm(forms.ModelForm):
    """Formulaire pour créer/modifier une année scolaire"""

    class Meta:
        model = SchoolYear
        fields = ['name', 'start_date', 'end_date']
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
        }

    def clean(self):
        cleaned_data = super().clean()
        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')

        if start_date and end_date and start_date >= end_date:
            raise ValidationError("La date de fin doit être postérieure à la date de début.")

        return cleaned_data


class LevelForm(forms.ModelForm):
    """Formulaire pour créer/modifier un niveau"""

    class Meta:
        model = Level
        fields = ['name', 'code', 'order', 'reportcard_type']


class ClassForm(forms.ModelForm):
    """Formulaire pour créer/modifier une classe"""

    class Meta:
        model = Class
        fields = ['name', 'level', 'school_year', 'main_teacher', 'capacity']
        widgets = {
            'capacity': forms.NumberInput(attrs={'min': 1, 'max': 50}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Filtrer les professeurs actifs
        self.fields['main_teacher'].queryset = Teacher.objects.filter(is_active=True)
        # Filtrer les années scolaires actives
        self.fields['school_year'].queryset = SchoolYear.objects.all()

    def clean(self):
        cleaned_data = super().clean()
        level = cleaned_data.get('level')
        school_year = cleaned_data.get('school_year')
        name = cleaned_data.get('name')

        if level and school_year and name:
            # Vérifier qu'il n'y a pas déjà une classe avec le même nom pour ce niveau et cette année
            existing_class = Class.objects.filter(
                name=name,
                level=level,
                school_year=school_year
            )
            if self.instance.pk:
                existing_class = existing_class.exclude(pk=self.instance.pk)

            if existing_class.exists():
                raise ValidationError(f"Une classe nommée '{name}' existe déjà pour le niveau {level} et l'année {school_year}.")

        return cleaned_data


class StudentForm(forms.ModelForm):
    """Formulaire pour créer/modifier un élève"""

    class Meta:
        model = Student
        fields = [
            'first_name', 'last_name', 'gender', 'birth_date', 'birth_place',
            'matricule', 'address', 'phone', 'email', 'current_class'
        ]
        widgets = {
            'birth_date': forms.DateInput(attrs={'type': 'date'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Filtrer les classes actives
        self.fields['current_class'].queryset = Class.objects.filter(is_active=True)

    def clean_birth_date(self):
        birth_date = self.cleaned_data.get('birth_date')
        if birth_date:
            # Vérifier que l'élève a au moins 3 ans et au plus 20 ans
            from datetime import date
            today = date.today()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

            if age < 3:
                raise ValidationError("L'élève doit avoir au moins 3 ans.")
            if age > 20:
                raise ValidationError("L'élève ne peut pas avoir plus de 20 ans.")

        return birth_date

    def clean_matricule(self):
        matricule = self.cleaned_data.get('matricule')
        if matricule:
            # Vérifier que le matricule est unique
            existing_student = Student.objects.filter(matricule=matricule)
            if self.instance.pk:
                existing_student = existing_student.exclude(pk=self.instance.pk)

            if existing_student.exists():
                raise ValidationError("Ce matricule est déjà utilisé.")

        return matricule


class TeacherForm(forms.ModelForm):
    """Formulaire pour créer/modifier un professeur"""

    class Meta:
        model = Teacher
        fields = [
            'matricule', 'first_name', 'last_name', 'email', 'phone', 'specialty'
        ]

    def clean_matricule(self):
        matricule = self.cleaned_data.get('matricule')
        if matricule:
            # Vérifier que le matricule est unique
            existing_teacher = Teacher.objects.filter(matricule=matricule)
            if self.instance.pk:
                existing_teacher = existing_teacher.exclude(pk=self.instance.pk)

            if existing_teacher.exists():
                raise ValidationError("Ce matricule est déjà utilisé.")

        return matricule

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email:
            # Vérifier que l'email est unique
            existing_teacher = Teacher.objects.filter(email=email)
            if self.instance.pk:
                existing_teacher = existing_teacher.exclude(pk=self.instance.pk)

            if existing_teacher.exists():
                raise ValidationError("Cette adresse email est déjà utilisée.")

        return email


class SubjectForm(forms.ModelForm):
    """Formulaire pour créer/modifier une matière"""

    class Meta:
        model = Subject
        fields = ['name', 'code', 'coefficient', 'description']

    def clean_coefficient(self):
        coefficient = self.cleaned_data.get('coefficient')
        if coefficient and coefficient <= 0:
            raise ValidationError("Le coefficient doit être supérieur à 0.")

        return coefficient


class TeacherAccountForm(forms.Form):
    """Formulaire pour créer un compte utilisateur pour un professeur"""

    teacher = forms.ModelChoiceField(
        queryset=Teacher.objects.none(),
        empty_label="Choisir un professeur...",
        widget=forms.Select(attrs={'class': 'form-select'}),
        label="Professeur",
        required=True
    )

    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'nom.prenom'}),
        label="Nom d'utilisateur",
        required=True
    )

    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'professeur@email.com'}),
        label="Email de récupération",
        required=True
    )

    password = forms.CharField(
        min_length=8,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        label="Mot de passe temporaire",
        required=True
    )

    password_confirm = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        label="Confirmer le mot de passe",
        required=True
    )

    role = forms.ChoiceField(
        choices=[
            ('teacher', 'Professeur'),
            ('head_teacher', 'Professeur Principal'),
            ('admin', 'Administrateur'),
        ],
        widget=forms.Select(attrs={'class': 'form-select'}),
        label="Rôle dans le système",
        required=True
    )

    status = forms.ChoiceField(
        choices=[
            ('active', 'Actif'),
            ('inactive', 'Inactif'),
        ],
        widget=forms.Select(attrs={'class': 'form-select'}),
        label="Statut du compte",
        required=True
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Afficher seulement les professeurs sans compte utilisateur
        self.fields['teacher'].queryset = Teacher.objects.filter(
            user__isnull=True,
            is_active=True
        ).order_by('last_name', 'first_name')

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise ValidationError("Ce nom d'utilisateur est déjà pris.")
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError("Cette adresse email est déjà utilisée.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')

        if password and password_confirm and password != password_confirm:
            raise ValidationError("Les mots de passe ne correspondent pas.")

        return cleaned_data


class TermForm(forms.ModelForm):
    """Formulaire pour créer/modifier un trimestre"""

    class Meta:
        model = Term
        fields = ['school_year', 'name', 'start_date', 'end_date']
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Filtrer les années scolaires
        self.fields['school_year'].queryset = SchoolYear.objects.all()

    def clean(self):
        cleaned_data = super().clean()
        school_year = cleaned_data.get('school_year')
        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')
        name = cleaned_data.get('name')

        if school_year and start_date and end_date:
            # Vérifier que les dates sont dans l'année scolaire
            if start_date < school_year.start_date or end_date > school_year.end_date:
                raise ValidationError("Les dates du trimestre doivent être comprises dans les dates de l'année scolaire.")

            # Vérifier qu'il n'y a pas de chevauchement avec d'autres trimestres
            overlapping_terms = Term.objects.filter(
                school_year=school_year,
                start_date__lt=end_date,
                end_date__gt=start_date
            )
            if self.instance.pk:
                overlapping_terms = overlapping_terms.exclude(pk=self.instance.pk)

            if overlapping_terms.exists():
                raise ValidationError("Les dates se chevauchent avec un autre trimestre.")

        return cleaned_data
