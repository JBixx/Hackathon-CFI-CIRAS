import { InscriptionsService } from './inscriptions.service';
export declare class InscriptionsController {
    private inscriptionsService;
    constructor(inscriptionsService: InscriptionsService);
    getMyInscriptions(req: any): Promise<({
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
    })[]>;
    getInscriptionById(id: string, req: any): Promise<{
        user: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
        };
        hackathon: {
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
    deleteInscription(id: string, req: any): Promise<{
        message: string;
    }>;
}
