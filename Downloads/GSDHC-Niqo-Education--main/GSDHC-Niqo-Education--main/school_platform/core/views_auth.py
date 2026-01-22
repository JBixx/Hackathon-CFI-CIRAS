from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as django_logout

from .utils import get_redirect_url_for_user


def custom_login(request):
    """
    Vue de connexion personnalisée avec redirection selon le rôle
    """
    if request.user.is_authenticated:
        return redirect(get_redirect_url_for_user(request.user))

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, f"Bienvenue, {user.first_name} {user.last_name} !")

            # Rediriger selon le rôle
            next_url = request.GET.get('next')
            if next_url:
                return redirect(next_url)

            return redirect(get_redirect_url_for_user(user))
        else:
            messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")

    return render(request, 'registration/login.html')


@login_required
def custom_logout(request):
    """
    Vue de déconnexion personnalisée
    """
    django_logout(request)
    messages.info(request, "Vous avez été déconnecté.")
    return redirect('login')
