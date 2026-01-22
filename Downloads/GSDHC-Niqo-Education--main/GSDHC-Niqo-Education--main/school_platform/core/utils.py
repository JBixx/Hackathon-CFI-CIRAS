from django.urls import reverse


def get_redirect_url_for_user(user):
    """
    Détermine l'URL de redirection selon le rôle de l'utilisateur
    """
    if not user.is_authenticated:
        return reverse('login')

    # Vérifier si l'utilisateur est un professeur principal
    if user.groups.filter(name='PROFESSEUR_PRINCIPAL').exists():
        return reverse('core:professeur_dashboard')

    # Vérifier si l'utilisateur est admin ou superuser
    if user.is_superuser or user.groups.filter(name__in=['Administrators', 'Admins']).exists():
        return reverse('core:admin_dashboard')

    # Par défaut, rediriger vers le dashboard professeur
    return reverse('core:professeur_dashboard')


def is_professeur_principal(user):
    """
    Vérifie si l'utilisateur est un professeur principal
    """
    return user.is_authenticated and user.groups.filter(name='PROFESSEUR_PRINCIPAL').exists()


def is_admin(user):
    """
    Vérifie si l'utilisateur est un administrateur
    """
    return user.is_authenticated and (
        user.is_superuser or
        user.groups.filter(name__in=['Administrators', 'Admins']).exists()
    )
