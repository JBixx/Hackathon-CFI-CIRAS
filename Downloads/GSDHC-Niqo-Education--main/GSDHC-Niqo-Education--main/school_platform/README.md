# GSDHC Niqo Education Platform

Une plateforme complète de gestion scolaire développée avec Django 4.2, offrant une interface moderne et professionnelle pour la gestion des établissements éducatifs.

## ✨ Fonctionnalités

### 🏫 Gestion Académique
- **Niveaux d'enseignement** : Gestion complète des niveaux (CP, CE1, CE2, CM1, CM2, 6ème, etc.)
- **Classes** : Organisation des classes avec professeurs principaux et capacités
- **Élèves** : Gestion des inscriptions, informations personnelles et affectations
- **Professeurs** : Gestion des enseignants avec spécialités et matières
- **Matières** : Catalogue des matières avec coefficients

### 📅 Organisation Scolaire
- **Années scolaires** : Gestion des périodes académiques
- **Trimestres** : Division de l'année en périodes d'évaluation
- **Comptes professeurs** : Gestion des comptes utilisateurs pour les enseignants

### 📊 Dashboard Administrateur
- **Tableau de bord moderne** : Interface premium avec statistiques en temps réel
- **Analyses visuelles** : Graphiques SVG pour la répartition par genre et évolution des performances
- **Actions rapides** : Accès direct aux fonctionnalités principales

### 🔐 Sécurité et Permissions
- **Authentification Django** : Système sécurisé avec gestion des sessions
- **Rôles utilisateurs** : Administrateur et Professeur Principal
- **Contrôle d'accès** : Permissions granulaires par fonctionnalité

### 📤 Import/Export
- **Import Excel** : Importation en masse des élèves et professeurs
- **Validation des données** : Vérification automatique des formats
- **Rapports d'import** : Suivi des succès et erreurs

## 🛠️ Technologies Utilisées

- **Backend** : Django 4.2
- **Base de données** : PostgreSQL (avec SQLite pour développement)
- **Frontend** : Bootstrap 5, HTML5, CSS3, JavaScript
- **Authentification** : Django Auth System
- **Déploiement** : Docker & Docker Compose
- **API** : Django REST Framework (extensible)

## 🚀 Installation et Déploiement

### Prérequis
- Python 3.8+
- PostgreSQL (ou SQLite pour développement)
- Docker & Docker Compose (optionnel)

### Installation Rapide avec Docker

```bash
# Cloner le repository
git clone https://github.com/Sparctuce-X-X/GSDHC-Niqo-Education.git
cd GSDHC-Niqo-Education

# Construire et lancer avec Docker
docker-compose up -d

# Créer les groupes d'utilisateurs
docker-compose exec web python manage.py create_groups

# Collecter les fichiers statiques
docker-compose exec web python manage.py collectstatic --noinput
```

### Installation Manuelle

```bash
# Cloner le repository
git clone https://github.com/Sparctuce-X-X/GSDHC-Niqo-Education.git
cd GSDHC-Niqo-Education

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configuration de la base de données
cp .env.example .env
# Éditer .env avec vos paramètres PostgreSQL

# Appliquer les migrations
python manage.py migrate

# Créer les groupes d'utilisateurs
python manage.py create_groups

# Créer un superutilisateur
python manage.py createsuperuser

# Collecter les fichiers statiques
python manage.py collectstatic

# Lancer le serveur
python manage.py runserver
```

## 📋 Configuration

### Variables d'environnement (.env)

```env
DEBUG=True
SECRET_KEY=votre-cle-secrete-ici
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Configuration Docker

Le projet inclut une configuration Docker complète :
- `Dockerfile` : Image de l'application Django
- `docker-compose.yml` : Orchestration des services
- `nginx.conf` : Configuration du serveur web

## 🎨 Interface Utilisateur

### Design System
- **Palette de couleurs** : Bleu, vert, blanc, gris (institutions)
- **Typographie** : Police moderne et lisible
- **Composants** : Cards, badges, tableaux responsives
- **Icônes** : Bootstrap Icons et Font Awesome

### Responsive Design
- **Mobile-first** : Optimisé pour tous les appareils
- **Tableaux adaptatifs** : Colonnes masquables sur petit écran
- **Navigation flexible** : Sidebar rétractable

## 📊 Fonctionnalités Avancées

### Dashboard Analytics
- Statistiques en temps réel
- Graphiques vectoriels SVG
- KPIs configurables

### Gestion des Rôles
- **Administrateur** : Accès complet à toutes les fonctionnalités
- **Professeur Principal** : Accès limité aux classes assignées

### Import/Export de Données
- Support des formats Excel (.xlsx, .xls)
- Validation automatique des données
- Gestion des erreurs et rapports

## 🔧 Développement

### Structure du Projet
```
school_platform/
├── core/                 # App principale
├── grades/              # Gestion des notes
├── school_platform/     # Configuration Django
├── templates/           # Templates HTML
├── static/             # Fichiers statiques
├── docker/             # Configuration Docker
└── docs/               # Documentation
```

### Commandes de Développement

```bash
# Tests
python manage.py test

# Linting
flake8 .

# Formatage
black .

# Créer une migration
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate
```

## 📚 API Documentation

L'API REST est documentée et extensible pour :
- Intégrations tierces
- Applications mobiles
- Interfaces web externes

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe de Développement

- **Développeur Principal** : [Votre nom]
- **Design UI/UX** : Interface professionnelle conçue pour l'éducation
- **Architecture** : Django RESTful avec séparation claire des responsabilités

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**🎓 GSDHC Niqo Education - Plateforme moderne de gestion scolaire**
