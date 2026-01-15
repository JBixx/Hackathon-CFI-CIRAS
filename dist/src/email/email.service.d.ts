export declare class EmailService {
    private transporter;
    constructor();
    sendEmail(to: string, subject: string, html: string): Promise<any>;
    sendAccusReception(email: string, nom: string, prenom: string, promo?: string, technologies?: string[], hackathon?: any): Promise<any>;
    sendAnnonceInscrits(email: string, nom: string, prenom: string, titre: string, contenu: string): Promise<any>;
}
