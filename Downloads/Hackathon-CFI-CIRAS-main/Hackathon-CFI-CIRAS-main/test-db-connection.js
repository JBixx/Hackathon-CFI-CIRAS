// Script simple pour tester la connexion à la base de données Render
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 Test de connexion à la base de données Render...');

  // Vérifier que DATABASE_URL est défini
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL n\'est pas défini dans .env');
    return;
  }

  console.log('✅ DATABASE_URL trouvé');

  try {
    // Créer le pool de connexions PostgreSQL
    const connectionString = databaseUrl.replace('prisma://', 'postgresql://');
    const pool = new Pool({ connectionString });

    // Créer l'adaptateur Prisma pour PostgreSQL
    const adapter = new PrismaPg(pool);

    // Créer le client Prisma
    const prisma = new PrismaClient({
      adapter,
      log: ['info', 'warn', 'error'],
    });

    console.log('🔌 Tentative de connexion...');

    // Tester la connexion
    await prisma.$connect();

    console.log('✅ Connexion réussie à PostgreSQL Render !');

    // Tester une requête simple
    console.log('📊 Test d\'une requête simple...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Requête exécutée avec succès:', result);

    // Fermer la connexion
    await prisma.$disconnect();
    console.log('🔌 Connexion fermée');

    console.log('🎉 Test terminé avec succès ! Votre BD Render est accessible.');

  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);

    if (error.code === 'P1001') {
      console.log('💡 Conseil: Vérifiez que l\'IP de Railway est autorisée dans Render');
    }

    if (error.code === 'P1010') {
      console.log('💡 Conseil: Vérifiez les identifiants de connexion dans DATABASE_URL');
    }
  }
}

// Exécuter le test
testConnection();
