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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let TeamsService = class TeamsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTeam(hackathonId, data) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id: hackathonId },
        });
        if (!hackathon)
            throw new common_1.NotFoundException(`Hackathon ${hackathonId} introuvable`);
        return this.prisma.team.create({
            data: {
                nom: data.nom,
                description: data.description,
                projetNom: data.projetNom,
                hackathonId,
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, email: true, nom: true, prenom: true },
                        },
                    },
                },
            },
        });
    }
    async getPublicTeamsByHackathon(hackathonId, page = 1, limit = 20) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id: hackathonId },
        });
        if (!hackathon)
            throw new common_1.NotFoundException(`Hackathon ${hackathonId} introuvable`);
        const skip = (page - 1) * limit;
        const [teams, total] = await Promise.all([
            this.prisma.team.findMany({
                where: { hackathonId },
                skip,
                take: limit,
                select: {
                    id: true,
                    nom: true,
                    description: true,
                    projetNom: true,
                    createdAt: true,
                    _count: {
                        select: { members: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.team.count({ where: { hackathonId } }),
        ]);
        return {
            data: teams,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getTeamsByHackathon(hackathonId, page = 1, limit = 20) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id: hackathonId },
        });
        if (!hackathon)
            throw new common_1.NotFoundException(`Hackathon ${hackathonId} introuvable`);
        const skip = (page - 1) * limit;
        const [teams, total] = await Promise.all([
            this.prisma.team.findMany({
                where: { hackathonId },
                skip,
                take: limit,
                include: {
                    members: {
                        include: {
                            user: {
                                select: { id: true, email: true, nom: true, prenom: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.team.count({ where: { hackathonId } }),
        ]);
        return {
            data: teams,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getTeamById(teamId) {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, email: true, nom: true, prenom: true },
                        },
                    },
                },
            },
        });
        if (!team)
            throw new common_1.NotFoundException(`Équipe ${teamId} introuvable`);
        return team;
    }
    async updateTeam(teamId, data) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        if (!team)
            throw new common_1.NotFoundException(`Équipe ${teamId} introuvable`);
        return this.prisma.team.update({
            where: { id: teamId },
            data: {
                ...(data.nom ? { nom: data.nom } : {}),
                ...(data.description !== undefined
                    ? { description: data.description }
                    : {}),
                ...(data.projetNom !== undefined ? { projetNom: data.projetNom } : {}),
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, email: true, nom: true, prenom: true },
                        },
                    },
                },
            },
        });
    }
    async deleteTeam(teamId) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        if (!team)
            throw new common_1.NotFoundException(`Équipe ${teamId} introuvable`);
        await this.prisma.team.delete({ where: { id: teamId } });
        return { message: 'Équipe supprimée' };
    }
    async addMemberToTeam(teamId, userId, role) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        if (!team)
            throw new common_1.NotFoundException(`Équipe ${teamId} introuvable`);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException(`Utilisateur ${userId} introuvable`);
        const alreadyMember = await this.prisma.teamMember.findFirst({
            where: { userId },
        });
        if (alreadyMember)
            throw new common_1.BadRequestException('Utilisateur déjà membre d’une autre équipe');
        return this.prisma.teamMember.create({
            data: { teamId, userId, role },
            include: {
                user: { select: { id: true, email: true, nom: true, prenom: true } },
            },
        });
    }
    async removeMemberFromTeam(teamId, userId) {
        const member = await this.prisma.teamMember.findUnique({
            where: { teamId_userId: { teamId, userId } },
        });
        if (!member)
            throw new common_1.NotFoundException('Membre introuvable');
        await this.prisma.teamMember.delete({
            where: { teamId_userId: { teamId, userId } },
        });
        return { message: 'Membre retiré' };
    }
    async getPublicTeams() {
        let hackathon = await this.prisma.hackathon.findFirst({
            where: {
                status: { in: [client_1.HackathonStatus.UPCOMING, client_1.HackathonStatus.ONGOING] },
            },
            orderBy: { dateDebut: 'asc' },
        });
        if (!hackathon) {
            hackathon = await this.prisma.hackathon.findFirst({
                where: { status: client_1.HackathonStatus.PAST },
                orderBy: { dateFin: 'desc' },
            });
        }
        if (!hackathon)
            return [];
        return this.prisma.team.findMany({
            where: { hackathonId: hackathon.id },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, email: true, nom: true, prenom: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map