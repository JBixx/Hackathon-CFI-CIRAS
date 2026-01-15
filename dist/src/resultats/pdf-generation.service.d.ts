export declare class PdfGenerationService {
    private readonly logger;
    generateInscriptionsListPdf(inscriptions: Array<{
        id: string;
        nom: string;
        prenom: string;
        email: string;
        promo?: string | null;
        classe?: string | null;
        statut?: string | null;
    }>, hackathonName: string): Promise<Buffer>;
}
