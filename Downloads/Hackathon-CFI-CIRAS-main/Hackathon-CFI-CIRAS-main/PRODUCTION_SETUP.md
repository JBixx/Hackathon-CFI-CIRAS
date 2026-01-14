# 🚀 Configuration Production - Backend NestJS + Prisma

## Vue d'ensemble
Backend robuste pour la gestion des hackathons avec NestJS, Prisma ORM et PostgreSQL.

## 🏗️ Architecture
- **Framework**: NestJS
- **ORM**: Prisma
- **Base de données**: PostgreSQL
- **Déploiement**: Railway
- **Authentification**: JWT

## 📋 Prérequis

### Base de données PostgreSQL
- Instance PostgreSQL accessible (Render, Railway, AWS RDS, etc.)
- URL de connexion au format: `postgresql://user:password@host:port/database?schema=public`

### Variables d'environnement
```env
# Base de données PostgreSQL (OBLIGATOIRE)
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# JWT Secret (OBLIGATOIRE)
JWT_SECRET="votre-cle-jwt-secrete-minimum-32-caracteres"

# Configuration serveur (OPTIONNEL)
PORT=3000
NODE_ENV=production

# Email (OPTIONNEL - pour les notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"
```

## 🛠️ Configuration Prisma

### Schema Prisma
Le schema utilise PostgreSQL et travaille dans le schema `public`:
```prisma
datasource db {
  provider = "postgresql"
  // URL configurée via DATABASE_URL
}
```

### Migrations
- Les migrations sont générées automatiquement
- Appliquées avec: `npx prisma migrate deploy`
- Compatible avec Railway et Render

## 🚀 Déploiement

### 1. Préparation locale
```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npm run prisma:generate

# Appliquer les migrations (optionnel en développement)
npm run prisma:push
```

### 2. Configuration Railway

#### Variables d'environnement obligatoires:
```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
JWT_SECRET=votre-cle-jwt-secrete
NODE_ENV=production
```

#### Variables optionnelles:
```
PORT=3000
APPLY_MIGRATIONS=true  # Applique automatiquement les migrations au démarrage
```

#### Commande de démarrage:
```bash
npm run railway:start
```

Cette commande:
1. Applique les migrations si `APPLY_MIGRATIONS=true`
2. Génère le client Prisma
3. Build l'application
4. Démarre le serveur en production

### 3. Vérification du déploiement

Après déploiement, tester ces endpoints:

#### Routes publiques (doivent fonctionner même avec DB vide):
```bash
# Hackathon actuel
GET /hackathons/public

# Hackathons disponibles
GET /hackathons/available

# Équipes publiques
GET /teams/public

# Annonces publiques
GET /annonces/public

# Résultats publics
GET /resultats/public
```

#### Routes d'administration (nécessitent authentification):
```bash
# Connexion admin
POST /auth/login

# Dashboard
GET /admin/dashboard
```

## 🛡️ Robustesse et gestion d'erreurs

### Base vide
Toutes les routes publiques retournent des données par défaut:
- `GET /hackathons/public` → `null` ou `[]`
- `GET /teams/public` → `{ data: [], meta: { total: 0 } }`
- `GET /annonces/public` → `[]`
- `GET /resultats/public` → `{ podium: null, preselectionnes: [] }`

### Gestion d'erreurs Prisma
- Try/catch autour de toutes les requêtes sensibles
- Logging des erreurs sans exposition
- Retour de réponses HTTP contrôlées (jamais 500 par défaut)
- Continuation du service même en cas d'erreur DB

## 🔧 Commandes de maintenance

### Développement:
```bash
# Démarrer en mode dev
npm run start:dev

# Tests
npm run test:e2e

# Lint
npm run lint
```

### Production:
```bash
# Build
npm run build

# Démarrage production
npm run start:prod

# Migrations
npm run prisma:deploy

# Reset DB (développement seulement)
npm run prisma:reset
```

### Base de données:
```bash
# Générer client
npm run prisma:generate

# Push schema (sans migration)
npm run prisma:push

# Studio Prisma (développement)
npx prisma studio
```

## 📊 Monitoring

### Logs importants:
- `✅ DATABASE_URL chargé depuis: /app/.env`
- `✅ Connecté à la base de données PostgreSQL`
- `Application is running on: http://localhost:PORT`

### Métriques à surveiller:
- Temps de réponse des routes publiques
- Taux d'erreur des requêtes Prisma
- Utilisation mémoire (limite Railway: 512MB-8GB)

## 🚨 Dépannage

### Erreur: "User was denied access on the database"
**Cause**: Problème de permissions sur Render
**Solution**:
1. Vérifier l'IP whitelist sur Render
2. Ajouter `0.0.0.0/0` pour autoriser toutes les IPs
3. Redéployer sur Railway

### Erreur: "prisma.hackathon.findFirst() invocation failed"
**Cause**: Table inexistante ou données manquantes
**Solution**: Les services sont maintenant robustes et gèrent ces cas

### Erreur: "Can't reach database server"
**Cause**: Problème de connectivité
**Solution**:
1. Vérifier `DATABASE_URL`
2. Tester la connexion: `psql $DATABASE_URL`
3. Vérifier le firewall de la DB

## 📝 API Documentation

Accessible sur: `https://votredomaine.railway.app/api`

Routes documentées avec Swagger UI.

## 🔒 Sécurité

- **Variables sensibles**: Jamais dans le code
- **JWT**: Expiration automatique
- **CORS**: Configuré pour les origines autorisées
- **Validation**: DTOs avec Zod
- **Rate limiting**: À implémenter selon les besoins

## 📞 Support

En cas de problème:
1. Vérifier les logs Railway
2. Tester localement avec `npm run start:dev`
3. Vérifier la configuration des variables d'environnement
4. Consulter cette documentation

---

**✅ Backend prêt pour la production avec gestion robuste des erreurs DB**
