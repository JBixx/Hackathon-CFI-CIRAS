# 🚀 Déploiement sur Railway

## Configuration de la base de données

1. **Créer une base de données PostgreSQL** sur Railway
2. **Récupérer les informations de connexion** (External Database URL)
3. **Ajouter la variable d'environnement** :
   - Nom: `DATABASE_URL`
   - Valeur: `postgresql://hackathon_db_3h8o_user:pnfvc3Pb8A5yNwQ2ar0r8tQo7dpyxrgH@dpg-d5hq3aidbo4c73e65950-a.frankfurt-postgres.render.com/hackathon_db_3h8o`

## Variables d'environnement Railway

Railway définit automatiquement :
- `PORT` (port d'écoute)
- Vous devez définir manuellement :
- `DATABASE_URL` (URL de votre base PostgreSQL)
- `JWT_SECRET` (clé secrète pour JWT)
- `NODE_ENV=production`

## Commande de démarrage

Railway utilisera automatiquement `npm start` ou vous pouvez spécifier :
```
npm run railway:start
```

Cette commande :
1. Génère le client Prisma
2. Build l'application
3. Démarre le serveur en production

## Vérification du déploiement

Après déploiement, vérifiez :
- ✅ L'application démarre sans erreurs
- ✅ La base de données est accessible
- ✅ Les tables Prisma sont créées
- ✅ L'API Swagger est accessible sur `/api`

## Dépannage

Si vous avez l'erreur `prisma.error Invalid prisma.hackathon.findFirst()` :
1. Vérifiez que `DATABASE_URL` est correctement configurée
2. Assurez-vous que la base de données est accessible depuis Railway
3. Vérifiez que les migrations ont été appliquées avec `npx prisma db push`

## Logs Railway

Surveillez les logs pour :
- Messages de connexion à la base de données
- Génération du client Prisma
- Démarrage du serveur NestJS
