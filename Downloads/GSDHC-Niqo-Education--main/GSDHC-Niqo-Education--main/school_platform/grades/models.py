from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from core.models import Student, Subject, Teacher, SchoolYear, Class


class Term(models.Model):
    """
    Modèle pour les périodes/trimestres scolaires
    """
    TERM_CHOICES = [
        (1, '1er Trimestre'),
        (2, '2ème Trimestre'),
        (3, '3ème Trimestre'),
    ]

    name = models.CharField(max_length=50, verbose_name="Nom de la période")
    number = models.PositiveIntegerField(choices=TERM_CHOICES, verbose_name="Numéro de trimestre")
    school_year = models.ForeignKey(SchoolYear, on_delete=models.CASCADE, verbose_name="Année scolaire")
    start_date = models.DateField(verbose_name="Date de début")
    end_date = models.DateField(verbose_name="Date de fin")
    is_active = models.BooleanField(default=False, verbose_name="Période active")

    class Meta:
        verbose_name = "Période"
        verbose_name_plural = "Périodes"
        ordering = ['school_year', 'number']
        unique_together = ['number', 'school_year']

    def __str__(self):
        return f"{self.school_year.name} - {self.name}"


class Grade(models.Model):
    """
    Modèle pour les notes individuelles
    """
    GRADE_TYPE_CHOICES = [
        ('CONTROLE', 'Contrôle'),
        ('DEVOIR', 'Devoir'),
        ('COMPOSITION', 'Composition'),
        ('PARTICIPATION', 'Participation'),
        ('COMPORTEMENT', 'Comportement'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, verbose_name="Élève")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, verbose_name="Matière")
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, verbose_name="Professeur")
    term = models.ForeignKey(Term, on_delete=models.CASCADE, verbose_name="Période")

    grade_type = models.CharField(max_length=20, choices=GRADE_TYPE_CHOICES, default='CONTROLE', verbose_name="Type de note")
    value = models.DecimalField(max_digits=4, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(20)], verbose_name="Note (/20)")
    coefficient = models.PositiveIntegerField(default=1, verbose_name="Coefficient")
    max_points = models.DecimalField(max_digits=4, decimal_places=2, default=20, verbose_name="Points maximum")
    date = models.DateField(verbose_name="Date de la note")
    description = models.CharField(max_length=200, blank=True, verbose_name="Description")

    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Note"
        verbose_name_plural = "Notes"
        ordering = ['-date', 'student', 'subject']
        unique_together = ['student', 'subject', 'date', 'grade_type']

    def __str__(self):
        return f"{self.student.full_name} - {self.subject.name} - {self.value}/{self.max_points}"

    @property
    def percentage(self):
        """Calcule le pourcentage de la note"""
        return (self.value / self.max_points) * 100


class ReportCard(models.Model):
    """
    Modèle pour les bulletins scolaires
    """
    REPORT_TYPE_CHOICES = [
        ('TRIMESTRIEL', 'Bulletin trimestriel'),
        ('ANNUEL', 'Bulletin annuel'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, verbose_name="Élève")
    school_year = models.ForeignKey(SchoolYear, on_delete=models.CASCADE, verbose_name="Année scolaire")
    term = models.ForeignKey(Term, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Période (pour bulletins trimestriels)")
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES, verbose_name="Type de bulletin")

    # Moyennes générales
    general_average = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, verbose_name="Moyenne générale")
    class_ranking = models.PositiveIntegerField(null=True, blank=True, verbose_name="Rang dans la classe")
    class_size = models.PositiveIntegerField(null=True, blank=True, verbose_name="Effectif de la classe")

    # Appréciations
    teacher_comments = models.TextField(blank=True, verbose_name="Appréciation du professeur principal")
    director_comments = models.TextField(blank=True, verbose_name="Appréciation du directeur")

    # Métadonnées
    generated_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de génération")
    is_final = models.BooleanField(default=False, verbose_name="Bulletin définitif")

    class Meta:
        verbose_name = "Bulletin"
        verbose_name_plural = "Bulletins"
        ordering = ['-generated_at']
        unique_together = ['student', 'school_year', 'term', 'report_type']

    def __str__(self):
        if self.report_type == 'TRIMESTRIEL':
            return f"Bulletin {self.term.name} - {self.student.full_name}"
        else:
            return f"Bulletin annuel {self.school_year.name} - {self.student.full_name}"


class SubjectGrade(models.Model):
    """
    Modèle pour les moyennes par matière dans un bulletin
    """
    report_card = models.ForeignKey(ReportCard, on_delete=models.CASCADE, verbose_name="Bulletin")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, verbose_name="Matière")

    # Moyenne de la matière
    average = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, verbose_name="Moyenne de la matière")
    coefficient = models.PositiveIntegerField(default=1, verbose_name="Coefficient")
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, verbose_name="Professeur de la matière")

    # Appréciation par matière
    appreciation = models.TextField(blank=True, verbose_name="Appréciation")

    class Meta:
        verbose_name = "Note par matière"
        verbose_name_plural = "Notes par matière"
        unique_together = ['report_card', 'subject']

    def __str__(self):
        return f"{self.report_card.student.full_name} - {self.subject.name} - {self.average}"
