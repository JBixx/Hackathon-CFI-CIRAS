export interface ExtractedParticipant {
    email: string;
    nom?: string;
    prenom?: string;
    fullName?: string;
    promo?: string;
    classe?: string;
    telephone?: string;
}
export declare class PdfExtractionService {
    private readonly logger;
    extractParticipantsFromPdf(pdfBuffer: Buffer): Promise<ExtractedParticipant[]>;
    matchParticipantsWithUsers(extractedParticipants: ExtractedParticipant[], users: Array<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
    }>): string[];
    private processExtractedText;
}
