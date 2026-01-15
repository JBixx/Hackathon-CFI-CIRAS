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
exports.HackathonService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let HackathonService = class HackathonService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPublicHackathon() {
        const hackathon = await this.prisma.hackathon.findFirst({
            where: {
                status: {
                    in: [client_1.HackathonStatus.UPCOMING, client_1.HackathonStatus.ONGOING],
                },
            },
            orderBy: {
                dateDebut: 'asc',
            },
        });
        if (!hackathon) {
            throw new common_1.NotFoundException('Aucun hackathon à venir trouvé');
        }
        const maintenant = new Date();
        const dateLimite = new Date(hackathon.dateLimiteInscription);
        const compteARebours = dateLimite > maintenant
            ? Math.max(0, Math.floor((dateLimite.getTime() - maintenant.getTime()) / 1000))
            : 0;
        return {
            id: hackathon.id,
            nom: hackathon.nom,
            description: hackathon.description,
            dateDebut: hackathon.dateDebut,
            dateFin: hackathon.dateFin,
            dateLimiteInscription: hackathon.dateLimiteInscription,
            status: hackathon.status,
            compteARebours: compteARebours,
        };
    }
    async getAvailableHackathons() {
        const maintenant = new Date();
        const hackathons = await this.prisma.hackathon.findMany({
            where: {
                status: {
                    in: [client_1.HackathonStatus.UPCOMING, client_1.HackathonStatus.ONGOING],
                },
                dateLimiteInscription: {
                    gte: maintenant,
                },
            },
            orderBy: {
                dateDebut: 'asc',
            },
            select: {
                id: true,
                nom: true,
                description: true,
                dateDebut: true,
                dateFin: true,
                dateLimiteInscription: true,
                status: true,
            },
        });
        return hackathons.map((hackathon) => {
            const dateLimite = new Date(hackathon.dateLimiteInscription);
            const compteARebours = dateLimite > maintenant
                ? Math.max(0, Math.floor((dateLimite.getTime() - maintenant.getTime()) / 1000))
                : 0;
            return {
                ...hackathon,
                compteARebours,
            };
        });
    }
    async getPastHackathons(page = 1, limit = 10, year) {
        const skip = (page - 1) * limit;
        const where = {
            status: client_1.HackathonStatus.PAST,
        };
        if (year) {
            where.dateDebut = {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${year + 1}-01-01`),
            };
        }
        const [hackathons, total] = await Promise.all([
            this.prisma.hackathon.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    dateDebut: 'desc',
                },
                select: {
                    id: true,
                    nom: true,
                    description: true,
                    dateDebut: true,
                    dateFin: true,
                    status: true,
                    _count: {
                        select: {
                            inscriptions: true,
                        },
                    },
                },
            }),
            this.prisma.hackathon.count({ where }),
        ]);
        return {
            data: hackathons.map((h) => ({
                id: h.id,
                nom: h.nom,
                description: h.description,
                dateDebut: h.dateDebut,
                dateFin: h.dateFin,
                status: h.status,
                nombreInscriptions: h._count.inscriptions,
            })),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findById(id) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id },
        });
        if (!hackathon) {
            throw new common_1.NotFoundException(`Hackathon avec l'ID ${id} non trouvé`);
        }
        return hackathon;
    }
    async getHackathonById(id) {
        return this.findById(id);
    }
    async createHackathon(createDto) {
        return this.prisma.hackathon.create({
            data: {
                nom: createDto.nom,
                description: createDto.description,
                dateDebut: createDto.dateDebut,
                dateFin: createDto.dateFin,
                dateLimiteInscription: createDto.dateLimiteInscription,
                status: createDto.status || client_1.HackathonStatus.UPCOMING,
            },
        });
    }
    async updateHackathon(id, updateDto) {
        await this.findById(id);
        return this.prisma.hackathon.update({
            where: { id },
            data: {
                ...(updateDto.nom && { nom: updateDto.nom }),
                ...(updateDto.description && { description: updateDto.description }),
                ...(updateDto.dateDebut && { dateDebut: updateDto.dateDebut }),
                ...(updateDto.dateFin && { dateFin: updateDto.dateFin }),
                ...(updateDto.dateLimiteInscription && {
                    dateLimiteInscription: updateDto.dateLimiteInscription,
                }),
                ...(updateDto.status && { status: updateDto.status }),
            },
        });
    }
    async deleteHackathon(id) {
        await this.findById(id);
        await this.prisma.hackathon.delete({
            where: { id },
        });
        return { message: 'Hackathon supprimé avec succès' };
    }
};
exports.HackathonService = HackathonService;
exports.HackathonService = HackathonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HackathonService);
//# sourceMappingURL=hackathon.service.js.map