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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AiService = class AiService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async analyzeInscription(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                inscriptions: {
                    include: {
                        hackathon: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
        }
        const analysisResult = this.performAnalysis(user);
        await this.prisma.iALog.create({
            data: {
                userId: user.id,
                type: client_1.TypeIALog.ANALYSE,
                input: {
                    userId: user.id,
                    email: user.email,
                    inscriptions: user.inscriptions.map((i) => ({
                        hackathonId: i.hackathonId,
                        hackathonNom: i.hackathon?.nom,
                    })),
                },
                output: {
                    score: analysisResult.score,
                    suggestions: analysisResult.suggestions,
                    metadata: analysisResult.metadata,
                },
                score: analysisResult.score,
                suggestions: analysisResult.suggestions,
                metadata: analysisResult.metadata,
            },
        });
        return analysisResult;
    }
    performAnalysis(user) {
        const reasons = [];
        let score = 100;
        if (user.email.includes('test') || user.email.includes('fake')) {
            score -= 20;
            reasons.push('Email suspect (contient "test" ou "fake")');
        }
        if (user.inscriptions.length > 5) {
            score -= 15;
            reasons.push("Nombre élevé d'inscriptions");
        }
        const latestInscription = user.inscriptions[user.inscriptions.length - 1];
        const technologies = latestInscription?.technologies
            ? Array.isArray(latestInscription.technologies)
                ? latestInscription.technologies
                : []
            : [];
        if (technologies.length === 0) {
            score -= 10;
            reasons.push("Aucune technologie renseignée dans l'inscription");
        }
        const promo = latestInscription?.promo;
        if (!promo) {
            score -= 5;
            reasons.push("Promo non renseignée dans l'inscription");
        }
        const suggestions = [];
        if (technologies.length === 0) {
            suggestions.push('Ajoutez vos technologies préférées dans votre inscription pour améliorer votre profil');
        }
        if (!promo) {
            suggestions.push('Renseignez votre promo dans votre inscription pour une meilleure visibilité');
        }
        if (user.inscriptions.length === 0) {
            suggestions.push("Vous n'êtes inscrit à aucun hackathon actuellement");
        }
        else if (user.inscriptions.length === 1) {
            suggestions.push("Pensez à vous inscrire à d'autres hackathons pour plus d'opportunités");
        }
        if (score < 50) {
            suggestions.push('Votre profil semble incomplet, pensez à le compléter');
        }
        return {
            score: Math.max(0, Math.min(100, score)),
            suggestions,
            metadata: {
                reasons: reasons.length > 0 ? reasons : ['Aucun problème détecté'],
                confidence: score > 70 ? 0.9 : score > 40 ? 0.7 : 0.5,
            },
        };
    }
    async getUserLogs(userId) {
        return this.prisma.iALog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllLogs(page = 1, limit = 50, type) {
        const skip = (page - 1) * limit;
        const where = {};
        if (type) {
            where.type = type;
        }
        const [logs, total] = await Promise.all([
            this.prisma.iALog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            nom: true,
                            prenom: true,
                        },
                    },
                },
            }),
            this.prisma.iALog.count({ where }),
        ]);
        return {
            data: logs,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map