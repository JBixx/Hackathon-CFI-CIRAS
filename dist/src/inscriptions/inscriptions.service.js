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
exports.InscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const events_gateway_1 = require("../events/events.gateway");
let InscriptionsService = class InscriptionsService {
    prisma;
    eventsGateway;
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async getMyInscriptions(userId) {
        return this.prisma.inscription.findMany({
            where: { userId },
            include: {
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
        });
    }
    async getInscriptionById(id, userId, userRole) {
        const inscription = await this.prisma.inscription.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        nom: true,
                        prenom: true,
                    },
                },
                hackathon: true,
            },
        });
        if (!inscription) {
            throw new common_1.NotFoundException(`Inscription avec l'ID ${id} non trouvée`);
        }
        if (userRole !== 'ADMIN' && inscription.userId !== userId) {
            throw new common_1.ForbiddenException("Vous n'avez pas accès à cette inscription");
        }
        return inscription;
    }
    async createInscription(userId, hackathonId) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id: hackathonId },
        });
        if (!hackathon) {
            throw new common_1.NotFoundException(`Hackathon avec l'ID ${hackathonId} non trouvé`);
        }
        const maintenant = new Date();
        if (new Date(hackathon.dateLimiteInscription) < maintenant) {
            throw new common_1.BadRequestException("La date limite d'inscription est dépassée");
        }
        if (hackathon.status === client_1.HackathonStatus.PAST) {
            throw new common_1.BadRequestException('Ce hackathon est déjà terminé');
        }
        const existingInscription = await this.prisma.inscription.findUnique({
            where: {
                userId_hackathonId: {
                    userId,
                    hackathonId,
                },
            },
        });
        if (existingInscription) {
            throw new common_1.BadRequestException('Vous êtes déjà inscrit à ce hackathon');
        }
        const inscription = await this.prisma.inscription.create({
            data: {
                userId,
                hackathonId,
            },
            include: {
                hackathon: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        nom: true,
                        prenom: true,
                    },
                },
            },
        });
        this.eventsGateway.emitNewInscription({
            userId: inscription.userId,
            hackathonId: inscription.hackathonId,
            inscriptionId: inscription.id,
            userEmail: inscription.user.email,
            userName: `${inscription.user.prenom} ${inscription.user.nom}`,
        });
        return inscription;
    }
    async deleteInscription(id, userId, userRole) {
        const inscription = await this.prisma.inscription.findUnique({
            where: { id },
        });
        if (!inscription) {
            throw new common_1.NotFoundException(`Inscription avec l'ID ${id} non trouvée`);
        }
        if (userRole !== 'ADMIN' && inscription.userId !== userId) {
            throw new common_1.ForbiddenException("Vous n'avez pas le droit de supprimer cette inscription");
        }
        await this.prisma.inscription.delete({
            where: { id },
        });
        return { message: 'Inscription supprimée avec succès' };
    }
    async getInscriptionsByHackathon(hackathonId) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id: hackathonId },
        });
        if (!hackathon) {
            throw new common_1.NotFoundException(`Hackathon avec l'ID ${hackathonId} non trouvé`);
        }
        return this.prisma.inscription.findMany({
            where: { hackathonId },
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
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.InscriptionsService = InscriptionsService;
exports.InscriptionsService = InscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], InscriptionsService);
//# sourceMappingURL=inscriptions.service.js.map