import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    console.log('🗄️ PRISMA: Initializing PrismaService...');

    // Vérifier que DATABASE_URL est défini
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      const errorMessage =
        "DATABASE_URL n'est pas défini dans les variables d'environnement. " +
        'Veuillez créer un fichier .env à la racine du projet avec DATABASE_URL.';
      console.error('❌ PRISMA:', errorMessage);
      throw new Error(
        'DATABASE_URL est requis. Créez un fichier .env à la racine du projet avec DATABASE_URL.',
      );
    }

    console.log('✅ PRISMA: DATABASE_URL found, configuring connection...');

    // Configuration avec adaptateur PostgreSQL pour compatibilité
    const connectionString = databaseUrl.replace('prisma://', 'postgresql://');
    console.log('🔧 PRISMA: Connection string configured (PostgreSQL adapter)');

    // Créer le pool de connexions PostgreSQL
    console.log('🏊 PRISMA: Creating PostgreSQL connection pool...');
    const pool = new Pool({ connectionString });
    console.log('✅ PRISMA: PostgreSQL pool created');

    // Créer l'adaptateur Prisma pour PostgreSQL
    console.log('🔌 PRISMA: Creating Prisma adapter...');
    const adapter = new PrismaPg(pool);
    console.log('✅ PRISMA: Prisma adapter created');

    super({
      adapter,
      log: ['warn', 'error'],
    });

    console.log('🎉 PRISMA: PrismaClient avec adaptateur PostgreSQL initialisé avec succès');
  }

  async onModuleInit() {
    console.log('🔌 PRISMA: Attempting to connect to database...');
    try {
      await this.$connect();
      console.log('✅ PRISMA: Successfully connected to PostgreSQL database');
      this.logger.log('Connecté à la base de données PostgreSQL');
    } catch (error: any) {
      console.log('❌ PRISMA: Database connection failed:', error.message);
      console.log('🔍 PRISMA: Error details:', error);
      this.logger.error('Erreur de connexion à la base de données:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Déconnecté de la base de données PostgreSQL');
  }
}
