import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
export declare class AnnonceService {
    private prisma;
    private queueService;
    constructor(prisma: PrismaService, queueService: QueueService);
    create(createAnnonceDto: CreateAnnonceDto, userId: string): Promise<{
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
    private sendBatchEmails;
    getAnnoncesInscrits(userId: string): Promise<({
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
