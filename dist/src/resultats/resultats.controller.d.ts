import type { Response } from 'express';
import { ResultatsService } from './resultats.service';
export declare class ResultatsController {
    private readonly resultatsService;
    constructor(resultatsService: ResultatsService);
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
    publishPreselections(hackathonId: string, data: {
        preselectionnes: string[];
    }): Promise<{
        id: string;
        hackathonId: string;
        preselectionnes: string[];
        preselectionsPubliees: boolean;
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
    downloadPreselectionsDocument(hackathonId: string, res: Response): Promise<void>;
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
    generateInscriptionsListPdf(hackathonId: string, res: Response): Promise<void>;
}
