"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    constructor() {
        console.log('🗄️ PRISMA: Initializing PrismaService...');
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            const errorMessage = "DATABASE_URL n'est pas défini dans les variables d'environnement. " +
                'Veuillez créer un fichier .env à la racine du projet avec DATABASE_URL.';
            console.error('❌ PRISMA:', errorMessage);
            throw new Error('DATABASE_URL est requis. Créez un fichier .env à la racine du projet avec DATABASE_URL.');
        }
        console.log('✅ PRISMA: DATABASE_URL found, configuring connection...');
        const connectionString = databaseUrl.replace('prisma://', 'postgresql://');
        console.log('🔧 PRISMA: Connection string configured (PostgreSQL adapter)');
        console.log('🏊 PRISMA: Creating PostgreSQL connection pool...');
        const pool = new pg_1.Pool({ connectionString });
        console.log('✅ PRISMA: PostgreSQL pool created');
        console.log('🔌 PRISMA: Creating Prisma adapter...');
        const adapter = new adapter_pg_1.PrismaPg(pool);
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
        }
        catch (error) {
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
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map