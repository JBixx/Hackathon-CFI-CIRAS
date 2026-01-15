import { PrismaService } from '../prisma/prisma.service';
export declare class HackathonService {
    private prisma;
    constructor(prisma: PrismaService);
    getPublicHackathon(): Promise<{
        id: string;
        nom: string;
        description: string | null;
        dateDebut: Date;
        dateFin: Date;
        dateLimiteInscription: Date;
        status: import("@prisma/client").$Enums.HackathonStatus;
        compteARebours: number;
    }>;
    getAvailableHackathons(): Promise<{
        compteARebours: number;
        id: string;
        nom: string;
        description: string | null;
        dateDebut: Date;
        dateFin: Date;
        dateLimiteInscription: Date;
        status: import("@prisma/client").$Enums.HackathonStatus;
    }[]>;
    getPastHackathons(page?: number, limit?: number, year?: number): Promise<{
        data: {
            id: string;
            nom: string;
            description: string | null;
            dateDebut: Date;
            dateFin: Date;
            status: import("@prisma/client").$Enums.HackathonStatus;
            nombreInscriptions: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<{
        id: string;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        themes: string[];
        dateDebut: Date;
        dateFin: Date;
        dateLimiteInscription: Date;
        status: import("@prisma/client").$Enums.HackathonStatus;
        registrationGoal: number | null;
        currentRegistrations: number | null;
    }>;
    getHackathonById(id: string): Promise<{
        id: string;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        themes: string[];
        dateDebut: Date;
        dateFin: Date;
        dateLimiteInscription: Date;
        status: import("@prisma/client").$Enums.HackathonStatus;
        registrationGoal: number | null;
        currentRegistrations: number | null;
    }>;
    createHackathon(createDto: any): Promise<{
        id: string;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        themes: string[];
        dateDebut: Date;
        dateFin: Date;
        dateLimiteInscription: Date;
        status: import("@prisma/client").$Enums.HackathonStatus;
        registrationGoal: number | null;
        currentRegistrations: number | null;
    }>;
    updateHackathon(id: string, updateDto: any): Promise<{
        id: string;
        nom: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        themes: string[];
        dateDebut: Date;
        dateFin: Date;
        dateLimiteInscription: Date;
        status: import("@prisma/client").$Enums.HackathonStatus;
        registrationGoal: number | null;
        currentRegistrations: number | null;
    }>;
    deleteHackathon(id: string): Promise<{
        message: string;
    }>;
}
