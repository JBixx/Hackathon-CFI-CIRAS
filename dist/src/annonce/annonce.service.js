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
exports.AnnonceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const queue_service_1 = require("../queue/queue.service");
const client_1 = require("@prisma/client");
let AnnonceService = class AnnonceService {
    prisma;
    queueService;
    constructor(prisma, queueService) {
        this.prisma = prisma;
        this.queueService = queueService;
    }
    async create(createAnnonceDto, userId) {
        if (createAnnonceDto.hackathonId) {
            const hackathon = await this.prisma.hackathon.findUnique({
                where: { id: createAnnonceDto.hackathonId },
            });
            if (!hackathon) {
                throw new common_1.NotFoundException(`Hackathon avec l'ID ${createAnnonceDto.hackathonId} non trouvé`);
            }
        }
        const annonce = await this.prisma.annonce.create({
            data: {
                titre: createAnnonceDto.titre,
                contenu: createAnnonceDto.contenu,
                cible: createAnnonceDto.cible,
                userId: userId,
                hackathonId: createAnnonceDto.hackathonId || null,
            },
        });
        if (createAnnonceDto.cible === client_1.AnnonceCible.INSCRITS) {
            await this.sendBatchEmails(annonce);
        }
        return annonce;
    }
    async getPublicAnnonces() {
        const annonces = await this.prisma.annonce.findMany({
            where: {
                cible: client_1.AnnonceCible.PUBLIC,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                hackathon: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
            },
        });
        return annonces;
    }
    async getAllAnnonces() {
        const annonces = await this.prisma.annonce.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                hackathon: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
            },
        });
        return annonces;
    }
    async sendBatchEmails(annonce) {
        let inscriptions;
        if (annonce.hackathonId) {
            inscriptions = await this.prisma.inscription.findMany({
                where: {
                    hackathonId: annonce.hackathonId,
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
                },
            });
        }
        else {
            inscriptions = await this.prisma.inscription.findMany({
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
            });
        }
        const emailPromises = inscriptions.map((inscription) => this.queueService.addEmailJob('annonce_inscrits', {
            email: inscription.user.email,
            nom: inscription.user.nom,
            prenom: inscription.user.prenom,
            titre: annonce.titre,
            contenu: annonce.contenu,
        }));
        await Promise.all(emailPromises);
    }
    async getAnnoncesInscrits(userId) {
        const inscriptions = await this.prisma.inscription.findMany({
            where: { userId },
            select: { hackathonId: true },
        });
        const hackathonIds = inscriptions.map((i) => i.hackathonId);
        const annonces = await this.prisma.annonce.findMany({
            where: {
                cible: client_1.AnnonceCible.INSCRITS,
                OR: [
                    { hackathonId: { in: hackathonIds } },
                    { hackathonId: null },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                hackathon: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
            },
        });
        return annonces;
    }
    async getAnnonceById(id) {
        const annonce = await this.prisma.annonce.findUnique({
            where: { id },
            include: {
                hackathon: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
            },
        });
        if (!annonce) {
            throw new common_1.NotFoundException(`Annonce avec l'ID ${id} non trouvée`);
        }
        return annonce;
    }
    async updateAnnonce(id, updateDto) {
        await this.getAnnonceById(id);
        if (updateDto.hackathonId) {
            const hackathon = await this.prisma.hackathon.findUnique({
                where: { id: updateDto.hackathonId },
            });
            if (!hackathon) {
                throw new common_1.NotFoundException(`Hackathon avec l'ID ${updateDto.hackathonId} non trouvé`);
            }
        }
        return this.prisma.annonce.update({
            where: { id },
            data: {
                ...(updateDto.titre && { titre: updateDto.titre }),
                ...(updateDto.contenu && { contenu: updateDto.contenu }),
                ...(updateDto.cible && { cible: updateDto.cible }),
                ...(updateDto.hackathonId !== undefined && {
                    hackathonId: updateDto.hackathonId,
                }),
            },
            include: {
                hackathon: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
            },
        });
    }
    async deleteAnnonce(id) {
        await this.getAnnonceById(id);
        await this.prisma.annonce.delete({
            where: { id },
        });
        return { message: 'Annonce supprimée avec succès' };
    }
};
exports.AnnonceService = AnnonceService;
exports.AnnonceService = AnnonceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        queue_service_1.QueueService])
], AnnonceService);
//# sourceMappingURL=annonce.service.js.map