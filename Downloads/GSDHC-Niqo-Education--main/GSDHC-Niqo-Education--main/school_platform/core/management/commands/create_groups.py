from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group


class Command(BaseCommand):
    help = 'Crée les groupes d\'utilisateurs nécessaires pour l\'application'

    def handle(self, *args, **options):
        # Créer le groupe Professeur Principal
        professeur_principal_group, created = Group.objects.get_or_create(
            name='PROFESSEUR_PRINCIPAL'
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS('Groupe "PROFESSEUR_PRINCIPAL" créé avec succès')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Le groupe "PROFESSEUR_PRINCIPAL" existe déjà')
            )

        # Créer le groupe Administrateurs
        admin_group, created = Group.objects.get_or_create(
            name='Administrators'
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS('Groupe "Administrators" créé avec succès')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Le groupe "Administrators" existe déjà')
            )

        # Créer le groupe Professeurs
        teachers_group, created = Group.objects.get_or_create(
            name='Teachers'
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS('Groupe "Teachers" créé avec succès')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Le groupe "Teachers" existe déjà')
            )

        # Créer le groupe Head Teachers
        head_teachers_group, created = Group.objects.get_or_create(
            name='Head Teachers'
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS('Groupe "Head Teachers" créé avec succès')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Le groupe "Head Teachers" existe déjà')
            )
