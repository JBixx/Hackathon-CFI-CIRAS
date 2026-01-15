import { AdminService } from './admin.service';
import { AnnonceService } from '../annonce/annonce.service';
export declare class AdminController {
    private adminService;
    private annonceService;
    constructor(adminService: AdminService, annonceService: AnnonceService);
    createAnnonce(createAnnonceDto: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        hackathonId: string | null;
        titre: string;
        contenu: string;
        cible: import("@prisma/client").$Enums.AnnonceCible;
        sentAt: Date | null;
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
    getAllInscriptions(page: number, limit: number): Promise<{
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
    getMonitoringLogs(page: number, limit: number, type?: string): Promise<{
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
            input: import("@prisma/client/runtime/client").JsonValue;
            output: import("@prisma/client/runtime/client").JsonValue;
            score: number | null;
            suggestions: string[];
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
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
    getAllUsers(page: number, limit: number): Promise<{
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
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, updateData: {
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
