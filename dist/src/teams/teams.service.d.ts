import { PrismaService } from '../prisma/prisma.service';
export declare class TeamsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTeam(hackathonId: string, data: {
        nom: string;
        description?: string;
        projetNom?: string;
    }): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                nom: string;
                prenom: string;
            };
        } & {
            id: string;
            role: string | null;
            createdAt: Date;
            userId: string;
            teamId: string;
        })[];
    } & {
        id: string;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        hackathonId: string;
        description: string | null;
        projetNom: string | null;
    }>;
    getPublicTeamsByHackathon(hackathonId: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            nom: string;
            createdAt: Date;
            _count: {
                members: number;
            };
            description: string | null;
            projetNom: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getTeamsByHackathon(hackathonId: string, page?: number, limit?: number): Promise<{
        data: ({
            members: ({
                user: {
                    id: string;
                    email: string;
                    nom: string;
                    prenom: string;
                };
            } & {
                id: string;
                role: string | null;
                createdAt: Date;
                userId: string;
                teamId: string;
            })[];
        } & {
            id: string;
            nom: string;
            createdAt: Date;
            updatedAt: Date;
            hackathonId: string;
            description: string | null;
            projetNom: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getTeamById(teamId: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                nom: string;
                prenom: string;
            };
        } & {
            id: string;
            role: string | null;
            createdAt: Date;
            userId: string;
            teamId: string;
        })[];
    } & {
        id: string;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        hackathonId: string;
        description: string | null;
        projetNom: string | null;
    }>;
    updateTeam(teamId: string, data: {
        nom?: string;
        description?: string;
        projetNom?: string | null;
    }): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                nom: string;
                prenom: string;
            };
        } & {
            id: string;
            role: string | null;
            createdAt: Date;
            userId: string;
            teamId: string;
        })[];
    } & {
        id: string;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        hackathonId: string;
        description: string | null;
        projetNom: string | null;
    }>;
    deleteTeam(teamId: string): Promise<{
        message: string;
    }>;
    addMemberToTeam(teamId: string, userId: string, role?: string): Promise<{
        user: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
        };
    } & {
        id: string;
        role: string | null;
        createdAt: Date;
        userId: string;
        teamId: string;
    }>;
    removeMemberFromTeam(teamId: string, userId: string): Promise<{
        message: string;
    }>;
    getPublicTeams(): Promise<({
        members: ({
            user: {
                id: string;
                email: string;
                nom: string;
                prenom: string;
            };
        } & {
            id: string;
            role: string | null;
            createdAt: Date;
            userId: string;
            teamId: string;
        })[];
    } & {
        id: string;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        hackathonId: string;
        description: string | null;
        projetNom: string | null;
    })[]>;
}
