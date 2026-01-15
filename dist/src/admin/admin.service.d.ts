import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
export declare class AdminService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    getAllInscriptions(page?: number, limit?: number): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                nom: string;
                prenom: string;
                role: import("@prisma/client").$Enums.Role;
            };
            hackathon: {
                id: string;
                nom: string;
                description: string | null;
                dateDebut: Date;
                dateFin: Date;
                status: import("@prisma/client").$Enums.HackathonStatus;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            hackathonId: string;
            promo: import("@prisma/client").$Enums.Promo | null;
            technologies: string[];
            statut: import("@prisma/client").$Enums.StatutInscription;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateInscription(id: string, updateDto: {
        statut?: string;
        promo?: string;
        technologies?: any;
    }): Promise<{
        user: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
        };
        hackathon: {
            id: string;
            nom: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        hackathonId: string;
        promo: import("@prisma/client").$Enums.Promo | null;
        technologies: string[];
        statut: import("@prisma/client").$Enums.StatutInscription;
    }>;
    deleteInscription(id: string): Promise<{
        message: string;
    }>;
    getAllUsers(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
            _count: {
                inscriptions: number;
            };
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateUser(id: string, updateDto: {
        nom?: string;
        prenom?: string;
        email?: string;
        role?: string;
    }): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getDashboard(): Promise<{
        hackathon: {
            id: string;
            nom: string;
            status: import("@prisma/client").$Enums.HackathonStatus;
        };
        totalInscrits: number;
        parPromo: {
            promo: string;
            count: number;
        }[];
        parTechnologie: {
            technologie: string;
            count: number;
        }[];
    } | {
        totalInscrits: number;
        parPromo: never[];
        parTechnologie: never[];
        message: string;
    }>;
    getMonitoringLogs(page?: number, limit?: number, type?: string): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                nom: string;
                prenom: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            type: import("@prisma/client").$Enums.TypeIALog;
            output: import("@prisma/client/runtime/client").JsonValue;
            input: import("@prisma/client/runtime/client").JsonValue;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            score: number | null;
            suggestions: string[];
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMetrics(): Promise<{
        inscriptions: {
            perHour: number;
            perDay: number;
            total: number;
        };
        users: {
            total: number;
        };
        ai: {
            totalAnalyses: number;
            averageScore: number | null;
        };
        timestamp: Date;
    }>;
    getUserProfile(userId: string): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserProfile(userId: string, updateData: {
        nom?: string;
        prenom?: string;
        email?: string;
        currentPassword?: string;
        newPassword?: string;
    }): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
}
