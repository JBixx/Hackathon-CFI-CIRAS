import { TeamsService } from './teams.service';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
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
    getTeamsByHackathon(hackathonId: string): Promise<{
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
    getAllTeamsByHackathon(hackathonId: string): Promise<{
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
    createTeam(hackathonId: string, payload: any): Promise<{
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
    getTeamById(id: string): Promise<{
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
    updateTeam(id: string, payload: any): Promise<{
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
    deleteTeam(id: string): Promise<{
        message: string;
    }>;
    addMember(teamId: string, payload: any): Promise<{
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
    removeMember(teamId: string, userId: string): Promise<{
        message: string;
    }>;
}
