import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HackathonStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTeam(
    hackathonId: string,
    data: { nom: string; description?: string; projetNom?: string },
  ) {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });
    if (!hackathon)
      throw new NotFoundException(`Hackathon ${hackathonId} introuvable`);

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

  async getPublicTeams() {
    try {
      // Récupérer tous les hackathons actifs pour lister leurs équipes
      const hackathons = await this.prisma.hackathon.findMany({
        where: {
          status: {
            in: ['UPCOMING', 'ONGOING'],
          },
        },
        select: { id: true },
      });

      if (hackathons.length === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            totalPages: 0,
          },
        };
      }

      const hackathonIds = hackathons.map(h => h.id);

      const teams = await this.prisma.team.findMany({
        where: {
          hackathonId: {
            in: hackathonIds,
          },
        },
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
        take: 50, // Limiter à 50 équipes pour les performances
      });

      return {
        data: teams,
        meta: {
          total: teams.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes publiques:', error);
      return {
        data: [],
        meta: {
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  async getPublicTeamsByHackathon(hackathonId: string, page: number = 1, limit: number = 20) {
    try {
      const hackathon = await this.prisma.hackathon.findUnique({
        where: { id: hackathonId },
      });
      if (!hackathon) {
        // Retourner un tableau vide au lieu de lancer une exception
        return {
          data: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        };
      }

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
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes publiques:', error);
      // Retourner une structure vide en cas d'erreur
      return {
        data: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  async getTeamsByHackathon(hackathonId: string, page: number = 1, limit: number = 20) {
    try {
      const hackathon = await this.prisma.hackathon.findUnique({
        where: { id: hackathonId },
      });
      if (!hackathon) {
        return {
          data: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        };
      }

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
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes:', error);
      return {
        data: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  async getTeamById(teamId: string) {
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
    if (!team) throw new NotFoundException(`Équipe ${teamId} introuvable`);
    return team;
  }

  async updateTeam(
    teamId: string,
    data: { nom?: string; description?: string; projetNom?: string | null },
  ) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundException(`Équipe ${teamId} introuvable`);

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

  async deleteTeam(teamId: string) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundException(`Équipe ${teamId} introuvable`);
    await this.prisma.team.delete({ where: { id: teamId } });
    return { message: 'Équipe supprimée' };
  }

  async addMemberToTeam(teamId: string, userId: string, role?: string) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundException(`Équipe ${teamId} introuvable`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`Utilisateur ${userId} introuvable`);

    const alreadyMember = await this.prisma.teamMember.findFirst({
      where: { userId },
    });
    if (alreadyMember)
      throw new BadRequestException(
        'Utilisateur déjà membre d’une autre équipe',
      );

    return this.prisma.teamMember.create({
      data: { teamId, userId, role },
      include: {
        user: { select: { id: true, email: true, nom: true, prenom: true } },
      },
    });
  }

  async removeMemberFromTeam(teamId: string, userId: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!member) throw new NotFoundException('Membre introuvable');

    await this.prisma.teamMember.delete({
      where: { teamId_userId: { teamId, userId } },
    });
    return { message: 'Membre retiré' };
  }

}
