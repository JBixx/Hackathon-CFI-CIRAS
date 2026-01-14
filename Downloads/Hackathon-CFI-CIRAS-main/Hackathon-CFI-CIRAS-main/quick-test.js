require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function test() {
  console.log('🔍 Test rapide des tables créées...');
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL non trouvé');
    return;
  }

  try {
    const connectionString = databaseUrl.replace('prisma://', 'postgresql://');
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    await prisma.$connect();
    console.log('✅ Connexion BD OK');

    // Tester une requête simple sur la table hackathon
    const result = await prisma.hackathon.findFirst();
    console.log('✅ Requête Prisma OK - Tables hackathon créées !');

    // Tester la table user
    const userResult = await prisma.user.findFirst();
    console.log('✅ Tables user créées aussi !');

    await prisma.$disconnect();
    console.log('🎉 Toutes les tables sont créées et accessibles !');
    console.log('🚀 Votre backend Railway devrait maintenant fonctionner parfaitement !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

test();
