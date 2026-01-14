# 🔧 Résoudre l'erreur "User was denied access on the database"

## Problème identifié
L'erreur `User was denied access on the database` indique que Railway ne peut pas accéder à votre base de données Render PostgreSQL.

## Solutions possibles

### 1. **Vérifier la configuration sur Railway**
Assurez-vous que ces variables d'environnement sont définies dans Railway :
```
DATABASE_URL=postgresql://hackathon_db_3h8o_user:pnfvc3Pb8A5yNwQ2ar0r8tQo7dpyxrgH@dpg-d5hq3aidbo4c73e65950-a.frankfurt-postgres.render.com/hackathon_db_3h8o
JWT_SECRET=votre-cle-jwt-secrete
NODE_ENV=production
```

### 2. **Vérifier les permissions de la base Render**
Sur Render, allez dans votre base de données PostgreSQL et vérifiez :
- ✅ **External Database URL** est activée
- ✅ **IP Whitelist** : Ajoutez `0.0.0.0/0` pour autoriser toutes les IPs
- ✅ **SSL Mode** : `require` ou `prefer`

### 3. **Test de connexion**
Testez la connexion depuis un autre environnement :
```bash
psql "postgresql://hackathon_db_3h8o_user:pnfvc3Pb8A5yNwQ2ar0r8tQo7dpyxrgH@dpg-d5hq3aidbo4c73e65950-a.frankfurt-postgres.render.com/hackathon_db_3h8o"
```

### 4. **Redémarrer Railway**
Après avoir modifié les variables d'environnement :
1. **Redeploy** l'application Railway
2. **Vérifiez les logs** pour voir si l'erreur persiste

### 5. **Alternative : Nouvelle base de données**
Si le problème persiste :
1. Créez une nouvelle base PostgreSQL sur Railway directement
2. Railway fournit automatiquement l'URL de connexion
3. Pas besoin de configuration manuelle

## Commandes de diagnostic

### Vérifier la connexion Prisma localement :
```bash
npx prisma db push
npx prisma studio
```

### Test rapide des APIs :
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api
```

## Logs attendus après correction
```
✅ DATABASE_URL chargé depuis: /app/.env
✅ Connecté à la base de données PostgreSQL
Application is running on: http://localhost:PORT
```

## Support
Si le problème persiste, contactez le support Render pour vérifier les permissions de votre base de données.
