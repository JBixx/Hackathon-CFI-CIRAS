# 🚀 Guide de Déploiement Hackathon - Pour vos Amis

## 👋 Bonjour !

Votre ami vous a partagé ce projet Hackathon incroyable ! Voici comment le déployer avec votre propre base de données.

## 📋 Prérequis

1. **Compte GitHub** (gratuit)
2. **Compte Railway** (gratuit - 5$/mois offert)
3. **Node.js** installé sur votre machine

---

## 🗄️ Étape 1 : Créer votre Base de Données Railway

### 1.1 Créer un compte Railway
- Allez sur [railway.app](https://railway.app)
- Créez un compte gratuit
- Vérifiez votre email

### 1.2 Créer un nouveau projet
- Cliquez **"New Project"**
- Choisissez **"PostgreSQL"**
- Donnez un nom à votre projet (ex: "hackathon-db")

### 1.3 Récupérer les variables de connexion
Dans votre dashboard Railway :
- Cliquez sur votre base PostgreSQL
- Allez dans l'onglet **"Variables"**
- Copiez ces valeurs :
  - `DATABASE_PUBLIC_URL` (la plus importante !)
  - `DATABASE_URL` (interne)
  - `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

---

## 💻 Étape 2 : Cloner et Configurer le Projet

### 2.1 Cloner le repository
```bash
git clone https://github.com/JBixx/Hackathon-CFI-CIRAS.git
cd Hackaton
```

### 2.2 Installer les dépendances
```bash
npm install
```

### 2.3 Configurer les variables d'environnement

**IMPORTANT :** Remplacez les valeurs par les vôtres !

Créez un fichier `.env` à la racine du projet :

```bash
# Configuration pour Railway PostgreSQL - REMPLACEZ PAR VOS VALEURS !
DATABASE_URL="postgresql://postgres:VOTRE_PASSWORD@mainline.proxy.rlwy.net:VOTRE_PORT/railway"

# JWT Secret (gardez tel quel ou changez si vous voulez)
JWT_SECRET="hackathon-jwt-secret-railway-2026"

# Configuration SMTP pour les emails
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app-gmail"
SMTP_FROM="votre-email@gmail.com"
SMTP_SECURE=false

# Port du serveur
PORT=3000

# Host pour Railway
HOST="0.0.0.0"

# Variables Railway spécifiques - REMPLACEZ !
PGPASSWORD="VOTRE_PASSWORD"
PGHOST="mainline.proxy.rlwy.net"
PGPORT=VOTRE_PORT
PGDATABASE="railway"
PGUSER="postgres"
```

### 2.4 Générer le client Prisma
```bash
npx prisma generate
```

### 2.5 Créer les tables dans votre base
```bash
npx prisma db push
```

### 2.6 Importer les données de test
```bash
npx ts-node prisma/seed.ts
```

---

## 🚀 Étape 3 : Tester Localement

### 3.1 Démarrer le serveur
```bash
npm run start:dev
```

### 3.2 Vérifier que ça fonctionne
- Ouvrez [http://localhost:3000](http://localhost:3000)
- Vous devriez voir "Hackathon API"

### 3.3 Tester l'interface Prisma
```bash
npx prisma studio
```
Ouvre une interface web pour voir vos données.

---

## 🌐 Étape 4 : Déployer en Production

### Option A : Déploiement sur Railway (Recommandé)

1. **Connecter Railway à GitHub :**
   - Allez sur [railway.app](https://railway.app)
   - "New Project" > "Deploy from GitHub repo"
   - Sélectionnez ce repository

2. **Ajouter les variables d'environnement :**
   - Dans votre projet Railway > "Variables"
   - Ajoutez toutes les variables de votre `.env`

3. **Déployer :**
   - Railway va automatiquement build et deploy
   - Votre API sera accessible à une URL comme : `https://hackathon-production.up.railway.app`

### Option B : Déploiement sur Render

1. **Créer un compte** sur [render.com](https://render.com)

2. **Nouveau service Web :**
   - "New" > "Web Service"
   - Connectez votre repo GitHub

3. **Configuration :**
   - **Runtime :** Node
   - **Build Command :** `npm install && npm run build`
   - **Start Command :** `npm run start:prod`
   - **Root Directory :** `./` (racine)

4. **Variables d'environnement :**
   - Copiez toutes les variables de votre `.env`

---

## 🔑 Comptes de Test

Après le déploiement, utilisez ces comptes pour tester :

- **Admin :** `admin@hackathon.com` / `admin123`
- **Utilisateur 1 :** `user1@hackathon.com` / `user123`
- **Utilisateur 2 :** `user2@hackathon.com` / `user123`

---

## 📚 Documentation API

Une fois déployé, consultez la documentation Swagger :
- **URL :** `https://votre-domaine.com/api`

---

## 🆘 Problèmes Courants

### Erreur de connexion à la base
- Vérifiez que votre base Railway est "ACTIVE"
- Vérifiez votre `DATABASE_PUBLIC_URL`

### Erreur lors du seed
```bash
npx prisma db push --force-reset
npx ts-node prisma/seed.ts
```

### Port déjà utilisé
Changez le PORT dans `.env` :
```bash
PORT=3001
```

---

## 🎉 Félicitations !

Votre Hackathon API est maintenant déployée ! 🎊

**Partagez l'URL de votre API avec vos amis et commencez à organiser votre hackathon !**

---

*Guide créé par votre ami pour faciliter le déploiement. Bonne chance ! 🚀*
