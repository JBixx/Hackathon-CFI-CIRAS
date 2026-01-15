"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const events_gateway_1 = require("../events/events.gateway");
let AdminService = class AdminService {
    prisma;
    eventsGateway;
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async getAllInscriptions(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [inscriptions, total] = await Promise.all([
            this.prisma.inscription.findMany({
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            nom: true,
                            prenom: true,
                            role: true,
                        },
                    },
                    hackathon: {
                        select: {
                            id: true,
                            nom: true,
                            description: true,
                            dateDebut: true,
                            dateFin: true,
                            status: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.inscription.count(),
        ]);
        return {
            data: inscriptions,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateInscription(id, updateDto) {
        const inscription = await this.prisma.inscription.findUnique({
            where: { id },
        });
        if (!inscription) {
            throw new common_1.NotFoundException(`Inscription avec l'ID ${id} non trouvée`);
        }
        return this.prisma.inscription.update({
            where: { id },
            data: {
                ...(updateDto.statut && { statut: updateDto.statut }),
                ...(updateDto.promo !== undefined && { promo: updateDto.promo }),
                ...(updateDto.technologies !== undefined && {
                    technologies: updateDto.technologies,
                }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        nom: true,
                        prenom: true,
                    },
                },
                hackathon: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
            },
        });
    }
    async deleteInscription(id) {
        const inscription = await this.prisma.inscription.findUnique({
            where: { id },
        });
        if (!inscription) {
            throw new common_1.NotFoundException(`Inscription avec l'ID ${id} non trouvée`);
        }
        await this.prisma.inscription.delete({
            where: { id },
        });
        return { message: 'Inscription supprimée avec succès' };
    }
    async getAllUsers(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    nom: true,
                    prenom: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            inscriptions: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.user.count(),
        ]);
        return {
            data: users,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateUser(id, updateDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
        }
        if (updateDto.email && updateDto.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateDto.email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('Cet email est déjà utilisé par un autre utilisateur');
            }
        }
        return this.prisma.user.update({
            where: { id },
            data: {
                ...(updateDto.nom && { nom: updateDto.nom }),
                ...(updateDto.prenom && { prenom: updateDto.prenom }),
                ...(updateDto.email && { email: updateDto.email }),
                ...(updateDto.role && { role: updateDto.role }),
            },
            select: {
                id: true,
                email: true,
                nom: true,
                prenom: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
        }
        if (user.role === 'ADMIN') {
            const adminCount = await this.prisma.user.count({
                where: { role: 'ADMIN' },
            });
            if (adminCount <= 1) {
                throw new common_1.BadRequestException('Impossible de supprimer le dernier administrateur');
            }
        }
        await this.prisma.user.delete({
            where: { id },
        });
        return { message: 'Utilisateur supprimé avec succès' };
    }
    async getDashboard() {
        const hackathonActuel = await this.prisma.hackathon.findFirst({
            where: {
                status: {
                    in: [client_1.HackathonStatus.UPCOMING, client_1.HackathonStatus.ONGOING],
                },
            },
            orderBy: {
                dateDebut: 'asc',
            },
        });
        if (!hackathonActuel) {
            return {
                totalInscrits: 0,
                parPromo: [],
                parTechnologie: [],
                message: 'Aucun hackathon actif',
            };
        }
        const totalInscrits = await this.prisma.inscription.count({
            where: {
                hackathonId: hackathonActuel.id,
            },
        });
        const parPromoRaw = await this.prisma.inscription.groupBy({
            by: ['promo'],
            where: {
                hackathonId: hackathonActuel.id,
            },
            _count: {
                promo: true,
            },
        });
        const parPromo = parPromoRaw.map((group) => ({
            promo: group.promo || 'Non renseignée',
            count: group._count.promo,
        }));
        const inscriptionsAvecTech = await this.prisma.inscription.findMany({
            where: {
                hackathonId: hackathonActuel.id,
            },
            select: {
                technologies: true,
            },
            take: 1000,
        });
        const parTechnologieMap = new Map();
        inscriptionsAvecTech.forEach((inscription) => {
            if (inscription.technologies) {
                const techs = Array.isArray(inscription.technologies)
                    ? inscription.technologies
                    : inscription.technologies;
                techs.forEach((tech) => {
                    parTechnologieMap.set(tech, (parTechnologieMap.get(tech) || 0) + 1);
                });
            }
        });
        const parTechnologie = Array.from(parTechnologieMap.entries())
            .map(([technologie, count]) => ({
            technologie,
            count,
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);
        const stats = {
            hackathon: {
                id: hackathonActuel.id,
                nom: hackathonActuel.nom,
                status: hackathonActuel.status,
            },
            totalInscrits,
            parPromo,
            parTechnologie,
        };
        this.eventsGateway.emitStatsUpdate({
            totalInscrits,
            parPromo,
            parTechnologie,
        });
        return stats;
    }
    async getMonitoringLogs(page = 1, limit = 50, type) {
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
    async getMetrics() {
        const maintenant = new Date();
        const ilYUneHeure = new Date(maintenant.getTime() - 60 * 60 * 1000);
        const ilYUnJour = new Date(maintenant.getTime() - 24 * 60 * 60 * 1000);
        const inscriptionsPerHour = await this.prisma.inscription.count({
            where: {
                createdAt: {
                    gte: ilYUneHeure,
                },
            },
        });
        const inscriptionsPerDay = await this.prisma.inscription.count({
            where: {
                createdAt: {
                    gte: ilYUnJour,
                },
            },
        });
        const totalInscriptions = await this.prisma.inscription.count();
        const totalUsers = await this.prisma.user.count();
        const totalAnalyses = await this.prisma.iALog.count({
            where: {
                type: client_1.TypeIALog.ANALYSE,
            },
        });
        const scores = await this.prisma.iALog.findMany({
            where: {
                type: client_1.TypeIALog.ANALYSE,
                score: { not: null },
            },
            select: {
                score: true,
            },
        });
        const moyenneScore = scores.length > 0
            ? scores.reduce((acc, log) => acc + (log.score || 0), 0) / scores.length
            : null;
        return {
            inscriptions: {
                perHour: inscriptionsPerHour,
                perDay: inscriptionsPerDay,
                total: totalInscriptions,
            },
            users: {
                total: totalUsers,
            },
            ai: {
                totalAnalyses,
                averageScore: moyenneScore
                    ? Math.round(moyenneScore * 100) / 100
                    : null,
            },
            timestamp: maintenant,
        };
    }
    async getUserProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                nom: true,
                prenom: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async updateUserProfile(userId, updateData) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateData.email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('Cet email est déjà utilisé par un autre utilisateur');
            }
        }
        const updatePayload = {};
        if (updateData.newPassword) {
            if (!updateData.currentPassword) {
                throw new common_1.BadRequestException('Le mot de passe actuel est requis pour changer le mot de passe');
            }
            const isPasswordValid = await bcrypt.compare(updateData.currentPassword, user.password);
            if (!isPasswordValid) {
                throw new common_1.BadRequestException('Le mot de passe actuel est incorrect');
            }
            const hashedPassword = await bcrypt.hash(updateData.newPassword, 10);
            updatePayload.password = hashedPassword;
        }
        if (updateData.nom !== undefined)
            updatePayload.nom = updateData.nom;
        if (updateData.prenom !== undefined)
            updatePayload.prenom = updateData.prenom;
        if (updateData.email !== undefined)
            updatePayload.email = updateData.email;
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: updatePayload,
            select: {
                id: true,
                email: true,
                nom: true,
                prenom: true,
                role: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => events_gateway_1.EventsGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], AdminService);
//# sourceMappingURL=admin.service.js.map