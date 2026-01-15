import { AnnonceService } from './annonce.service';
export declare class AnnonceController {
    private annonceService;
    constructor(annonceService: AnnonceService);
    getPublicAnnonces(): Promise<({
        hackathon: {
            id: string;
            nom: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        hackathonId: string | null;
        titre: string;
        contenu: string;
        cible: import("@prisma/client").$Enums.AnnonceCible;
        sentAt: Date | null;
    })[]>;
    getAnnoncesInscrits(req: any): Promise<({
        hackathon: {
            id: string;
            nom: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        hackathonId: string | null;
        titre: string;
        contenu: string;
        cible: import("@prisma/client").$Enums.AnnonceCible;
        sentAt: Date | null;
    })[]>;
    getAllAnnonces(): Promise<({
        hackathon: {
            id: string;
            nom: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        hackathonId: string | null;
        titre: string;
        contenu: string;
        cible: import("@prisma/client").$Enums.AnnonceCible;
        sentAt: Date | null;
    })[]>;
    getAnnonceById(id: string): Promise<{
        hackathon: {
            id: string;
            nom: string;
        } | null;
    } & {
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
    create(createAnnonceDto: any, req: any): Promise<{
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
    updateAnnonce(id: string, updateDto: any): Promise<{
        hackathon: {
            id: string;
            nom: string;
        } | null;
    } & {
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
    deleteAnnonce(id: string): Promise<{
        message: string;
    }>;
}
