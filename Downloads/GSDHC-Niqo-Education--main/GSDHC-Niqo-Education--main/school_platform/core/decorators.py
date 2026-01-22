from functools import wraps
from django.http import HttpResponseForbidden
from django.shortcuts import redirect
from django.contrib import messages


def professeur_principal_required(view_func):
    """
    Décorateur pour vérifier que l'utilisateur est un Professeur Principal
    """
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')

        # Vérifier si l'utilisateur est dans le groupe PROFESSEUR_PRINCIPAL
        if not request.user.groups.filter(name='PROFESSEUR_PRINCIPAL').exists():
            messages.error(request, "Accès refusé. Vous n'avez pas les permissions nécessaires.")
            return redirect('core:admin_dashboard')

        return view_func(request, *args, **kwargs)
    return _wrapped_view


def admin_required(view_func):
    """
    Décorateur pour vérifier que l'utilisateur est un Administrateur
    """
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')

        # Vérifier si l'utilisateur est admin (superuser ou dans groupe admin)
        if not (request.user.is_superuser or request.user.groups.filter(name__in=['Administrators', 'Admins']).exists()):
            messages.error(request, "Accès réservé aux administrateurs.")
            return redirect('core:professeur_dashboard')

        return view_func(request, *args, **kwargs)
    return _wrapped_view


def filter_by_assigned_classes(view_func):
    """
    Décorateur pour filtrer automatiquement les données selon les classes assignées au professeur principal
    """
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')

        # Pour les professeurs principaux, filtrer par classes assignées
        if request.user.groups.filter(name='PROFESSEUR_PRINCIPAL').exists():
            # Récupérer les classes où l'utilisateur est professeur principal
            assigned_classes = request.user.teacher.main_teacher_classes.filter(is_active=True) if hasattr(request.user, 'teacher') else []

            # Ajouter les classes assignées au contexte de la requête
            request.assigned_classes = assigned_classes
            request.assigned_class_ids = [cls.id for cls in assigned_classes]

        return view_func(request, *args, **kwargs)
    return _wrapped_view
