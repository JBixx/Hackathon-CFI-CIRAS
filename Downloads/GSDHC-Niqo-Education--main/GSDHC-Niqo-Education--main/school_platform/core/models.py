from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class SchoolYear(models.Model):
    """
    Modèle pour les années scolaires (ex: 2023-2024)
    """
    name = models.CharField(max_length=20, unique=True, verbose_name="Année scolaire")
    start_date = models.DateField(verbose_name="Date de début")
    end_date = models.DateField(verbose_name="Date de fin")
    is_active = models.BooleanField(default=False, verbose_name="Année active")

    class Meta:
        verbose_name = "Année scolaire"
        verbose_name_plural = "Années scolaires"
        ordering = ['-start_date']

    def __str__(self):
        return self.name


class Level(models.Model):
    """
    Modèle pour les niveaux d'enseignement (CP, CE1, CE2, CM1, CM2, 6ème, etc.)
    """
    REPORTCARD_CHOICES = [
        ('primary', 'Primaire'),
        ('secondary', 'Secondaire'),
        ('higher', 'Supérieur'),
    ]

    name = models.CharField(max_length=50, unique=True, verbose_name="Nom du niveau")
    code = models.CharField(max_length=10, unique=True, verbose_name="Code du niveau")
    order = models.PositiveIntegerField(unique=True, verbose_name="Ordre d'affichage")
    reportcard_type = models.CharField(
        max_length=20,
        choices=REPORTCARD_CHOICES,
        default='primary',
        verbose_name="Type de bulletin"
    )

    class Meta:
        verbose_name = "Niveau"
        verbose_name_plural = "Niveaux"
        ordering = ['order']

    def __str__(self):
        return self.name


class Subject(models.Model):
    """
    Modèle pour les matières enseignées
    """
    name = models.CharField(max_length=100, unique=True, verbose_name="Nom de la matière")
    code = models.CharField(max_length=10, unique=True, verbose_name="Code de la matière")
    coefficient = models.PositiveIntegerField(default=1, verbose_name="Coefficient")
    description = models.TextField(blank=True, verbose_name="Description")
    is_active = models.BooleanField(default=True, verbose_name="Matière active")

    class Meta:
        verbose_name = "Matière"
        verbose_name_plural = "Matières"
        ordering = ['name']

    def __str__(self):
        return self.name


class Teacher(models.Model):
    """
    Modèle pour les professeurs
    """
    SPECIALTY_CHOICES = [
        ('mathematiques', 'Mathématiques'),
        ('francais', 'Français'),
        ('histoire', 'Histoire-Géographie'),
        ('sciences', 'Sciences de la Vie et de la Terre'),
        ('physique', 'Physique-Chimie'),
        ('anglais', 'Anglais'),
        ('education_civique', 'Éducation Civique'),
        ('arts_plastiques', 'Arts Plastiques'),
        ('musique', 'Éducation Musicale'),
        ('eps', 'Éducation Physique'),
    ]

    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Utilisateur")
    matricule = models.CharField(max_length=20, unique=True, verbose_name="Matricule")
    first_name = models.CharField(max_length=50, verbose_name="Prénom")
    last_name = models.CharField(max_length=50, verbose_name="Nom")
    email = models.EmailField(blank=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    specialty = models.CharField(max_length=50, choices=SPECIALTY_CHOICES, default='francais', verbose_name="Spécialité")
    subjects = models.ManyToManyField(Subject, blank=True, verbose_name="Matières enseignées")
    is_active = models.BooleanField(default=True, verbose_name="Professeur actif")

    class Meta:
        verbose_name = "Professeur"
        verbose_name_plural = "Professeurs"
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Class(models.Model):
    """
    Modèle pour les classes (ex: CP A, CE1 B, etc.)
    """
    name = models.CharField(max_length=50, verbose_name="Nom de la classe")
    level = models.ForeignKey(Level, on_delete=models.CASCADE, verbose_name="Niveau")
    school_year = models.ForeignKey(SchoolYear, on_delete=models.CASCADE, verbose_name="Année scolaire")
    main_teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Professeur principal")
    capacity = models.PositiveIntegerField(default=30, verbose_name="Capacité maximale")
    is_active = models.BooleanField(default=True, verbose_name="Classe active")

    class Meta:
        verbose_name = "Classe"
        verbose_name_plural = "Classes"
        ordering = ['level__order', 'name']
        unique_together = ['name', 'school_year']

    def __str__(self):
        return f"{self.level.name} - {self.name}"

    @property
    def current_students_count(self):
        """Retourne le nombre d'élèves actuellement inscrits dans cette classe"""
        return self.student_set.filter(is_active=True).count()


class Student(models.Model):
    """
    Modèle pour les élèves
    """
    GENDER_CHOICES = [
        ('M', 'Masculin'),
        ('F', 'Féminin'),
    ]

    matricule = models.CharField(max_length=20, unique=True, verbose_name="Matricule")
    first_name = models.CharField(max_length=50, verbose_name="Prénom")
    last_name = models.CharField(max_length=50, verbose_name="Nom")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name="Genre")
    birth_date = models.DateField(verbose_name="Date de naissance")
    birth_place = models.CharField(max_length=100, blank=True, verbose_name="Lieu de naissance")
    address = models.TextField(blank=True, verbose_name="Adresse")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    email = models.EmailField(blank=True, verbose_name="Email")

    # Informations scolaires
    current_class = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Classe actuelle")
    enrollment_date = models.DateField(auto_now_add=True, verbose_name="Date d'inscription")
    is_active = models.BooleanField(default=True, verbose_name="Élève actif")

    # Informations parentales
    father_name = models.CharField(max_length=100, blank=True, verbose_name="Nom du père")
    mother_name = models.CharField(max_length=100, blank=True, verbose_name="Nom de la mère")
    parent_phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone parent")
    parent_email = models.EmailField(blank=True, verbose_name="Email parent")

    class Meta:
        verbose_name = "Élève"
        verbose_name_plural = "Élèves"
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.matricule})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def age(self):
        """Calcule l'âge de l'élève"""
        from datetime import date
        today = date.today()
        return today.year - self.birth_date.year - ((today.month, today.day) < (self.birth_date.month, self.birth_date.day))
