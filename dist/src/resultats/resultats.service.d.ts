import { PrismaService } from '../prisma/prisma.service';
import { PdfExtractionService } from './pdf-extraction.service';
import { PdfGenerationService } from './pdf-generation.service';
import { EmailService } from '../email/email.service';
export declare class ResultatsService {
    private readonly prisma;
    private readonly pdfExtractionService;
    private readonly pdfGenerationService;
    private readonly emailService;
    private readonly uploadsDir;
    constructor(prisma: PrismaService, pdfExtractionService: PdfExtractionService, pdfGenerationService: PdfGenerationService, emailService: EmailService);
    getResultats(hackathonId: string): Promise<{
        hackathonId: string;
        premierPlace: null;
        deuxiemePlace: null;
        troisiemePlace: null;
        preselectionnes: never[];
        podiumPublie: boolean;
        preselectionsPubliees: boolean;
        documentPreselectionsName: null;
        documentPreselectionsUploadedAt: null;
        id?: undefined;
        createdAt?: undefined;
        updatedAt?: undefined;
    } | {
        id: string;
        hackathonId: string;
        premierPlace: string | null;
        deuxiemePlace: string | null;
        troisiemePlace: string | null;
        preselectionnes: string[];
        podiumPublie: boolean;
        preselectionsPubliees: boolean;
        documentPreselectionsName: string | null;
        documentPreselectionsUploadedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    publishPodium(hackathonId: string, data: {
        premierPlace?: string;
        deuxiemePlace?: string;
        troisiemePlace?: string;
    }): Promise<{
        id: string;
        hackathonId: string;
        premierPlace: string | null;
        deuxiemePlace: string | null;
        troisiemePlace: string | null;
        podiumPublie: boolean;
    }>;
    publishPreselections(hackathonId: string, preselectionnes: string[]): Promise<{
        id: string;
        hackathonId: string;
        preselectionnes: string[];
        preselectionsPubliees: boolean;
    }>;
    unpublishPodium(hackathonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hackathonId: string;
        premierPlace: string | null;
        deuxiemePlace: string | null;
        troisiemePlace: string | null;
        podiumPublie: boolean;
        preselectionnes: string[];
        preselectionsPubliees: boolean;
        documentPreselectionsName: string | null;
        documentPreselectionsUploadedAt: Date | null;
    }>;
    unpublishPreselections(hackathonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hackathonId: string;
        premierPlace: string | null;
        deuxiemePlace: string | null;
        troisiemePlace: string | null;
        podiumPublie: boolean;
        preselectionnes: string[];
        preselectionsPubliees: boolean;
        documentPreselectionsName: string | null;
        documentPreselectionsUploadedAt: Date | null;
    }>;
    getPublicResultats(): Promise<{
        hackathonId: null;
        podiumPublie: boolean;
        preselectionsPubliees: boolean;
        premierPlace: null;
        deuxiemePlace: null;
        troisiemePlace: null;
        preselectionnes: never[];
        documentPreselectionsName: null;
        hasPreselectionsDocument: boolean;
    } | {
        hackathonId: string;
        preselectionnes: string[];
        documentPreselectionsName: string | null;
        hasPreselectionsDocument: boolean;
        premierPlace: null;
        deuxiemePlace: null;
        troisiemePlace: null;
        podiumPublie: boolean;
        preselectionsPubliees: boolean;
        documentPreselectionsUploadedAt: null;
        id?: undefined;
        createdAt?: undefined;
        updatedAt?: undefined;
    } | {
        hackathonId: string;
        preselectionnes: string[];
        documentPreselectionsName: string | null;
        hasPreselectionsDocument: boolean;
        id: string;
        premierPlace: string | null;
        deuxiemePlace: string | null;
        troisiemePlace: string | null;
        podiumPublie: boolean;
        preselectionsPubliees: boolean;
        documentPreselectionsUploadedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadPreselectionsDocument(hackathonId: string, file: Express.Multer.File): Promise<{
        id: string;
        hackathonId: string;
        documentName: string;
        extractedCount: number;
        matchedCount: number;
        preselectionnes: string[];
        extractedEmails: string[];
        unmatchedEmails: string[];
    }>;
    getPreselectionsDocument(hackathonId: string): Promise<{
        path: string;
        name: string;
        buffer: NonSharedBuffer;
    }>;
    deletePreselectionsDocument(hackathonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hackathonId: string;
        premierPlace: string | null;
        deuxiemePlace: string | null;
        troisiemePlace: string | null;
        podiumPublie: boolean;
        preselectionnes: string[];
        preselectionsPubliees: boolean;
        documentPreselectionsName: string | null;
        documentPreselectionsUploadedAt: Date | null;
    }>;
    generateInscriptionsListPdf(): Promise<Buffer>;
}
