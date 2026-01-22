from django.shortcuts import redirect
from django.urls import reverse
from .utils import get_redirect_url_for_user


class RoleBasedAccessMiddleware:
    """
    Middleware pour gérer l'accès basé sur les rôles
    Redirige automatiquement les utilisateurs vers leur interface appropriée
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Si l'utilisateur n'est pas authentifié, continuer
        if not request.user.is_authenticated:
            return self.get_response(request)

        # Vérifier si l'utilisateur essaie d'accéder à une URL admin
        admin_urls = [
            '/dashboard/',
            '/admin/',
            '/dashboard/levels/',
            '/dashboard/classes/',
            '/dashboard/students/',
            '/dashboard/teachers/',
            '/dashboard/subjects/',
            '/dashboard/school-years/',
            '/dashboard/terms/',
            '/dashboard/teacher_accounts/',
            '/dashboard/import/',
        ]

        current_path = request.path

        # Si c'est une URL admin et que l'utilisateur est un professeur principal
        is_admin_url = any(url in current_path for url in admin_urls)
        is_professeur_principal = request.user.groups.filter(name='PROFESSEUR_PRINCIPAL').exists()

        if is_admin_url and is_professeur_principal:
            # Rediriger vers le dashboard professeur
            return redirect('core:professeur_dashboard')

        # Si c'est une URL professeur et que l'utilisateur est admin
        professeur_urls = [
            '/dashboard/professeur/',
        ]

        is_professeur_url = any(url in current_path for url in professeur_urls)
        is_admin = request.user.is_superuser or request.user.groups.filter(name__in=['Administrators', 'Admins']).exists()

        if is_professeur_url and is_admin and current_path != reverse('core:professeur_dashboard'):
            # Les admins peuvent accéder aux URLs professeurs pour consultation, mais pas pour modification
            pass

        return self.get_response(request)
