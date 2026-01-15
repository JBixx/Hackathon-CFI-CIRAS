"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultatsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma_service_1 = require("../prisma/prisma.service");
const pdf_extraction_service_1 = require("./pdf-extraction.service");
const pdf_generation_service_1 = require("./pdf-generation.service");
const email_service_1 = require("../email/email.service");
let ResultatsService = class ResultatsService {
    prisma;
    pdfExtractionService;
    pdfGenerationService;
    emailService;
    uploadsDir = path.join(process.cwd(), 'uploads', 'pdfs');
    constructor(prisma, pdfExtractionService, pdfGenerationService, emailService) {
        this.prisma = prisma;
        this.pdfExtractionService = pdfExtractionService;
        this.pdfGenerationService = pdfGenerationService;
        this.emailService = emailService;
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }
    async getResultats(hackathonId) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id: hackathonId },
        });
        if (!hackathon)
            throw new common_1.NotFoundException(`Hackathon avec l'ID ${hackathonId} non trouvé`);
        const resultat = await this.prisma.resultats.findUnique({
            where: { hackathonId },
        });
        if (!resultat) {
            return {
                hackathonId,
                premierPlace: null,
                deuxiemePlace: null,
                troisiemePlace: null,
                preselectionnes: [],
                podiumPublie: false,
                preselectionsPubliees: false,
                documentPreselectionsName: null,
                documentPreselectionsUploadedAt: null,
            };
        }
        const preselectionnesArray = Array.isArray(resultat.preselectionnes)
            ? resultat.preselectionnes
            : [];
        return {
            id: resultat.id,
            hackathonId: resultat.hackathonId,
            premierPlace: resultat.premierPlace,
            deuxiemePlace: resultat.deuxiemePlace,
            troisiemePlace: resultat.troisiemePlace,
            preselectionnes: preselectionnesArray,
            podiumPublie: resultat.podiumPublie,
            preselectionsPubliees: resultat.preselectionsPubliees,
            documentPreselectionsName: resultat.documentPreselectionsName,
            documentPreselectionsUploadedAt: resultat.documentPreselectionsUploadedAt,
            createdAt: resultat.createdAt,
            updatedAt: resultat.updatedAt,
        };
    }
    async publishPodium(hackathonId, data) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id: hackathonId },
        });
        if (!hackathon)
            throw new common_1.NotFoundException(`Hackathon avec l'ID ${hackathonId} non trouvé`);
        const hasAtLeastOneWinner = !!(data.premierPlace ||
            data.deuxiemePlace ||
            data.troisiemePlace);
        if (!hasAtLeastOneWinner) {
            throw new common_1.BadRequestException('Au moins un gagnant doit être sélectionné pour publier le podium');
        }
        const resultat = await this.prisma.resultats.upsert({
            where: { hackathonId },
            update: {
                premierPlace: data.premierPlace || null,
                deuxiemePlace: data.deuxiemePlace || null,
                troisiemePlace: data.troisiemePlace || null,
                podiumPublie: true,
            },
            create: {
                hackathonId,
                premierPlace: data.premierPlace || null,
                deuxiemePlace: data.deuxiemePlace || null,
                troisiemePlace: data.troisiemePlace || null,
                podiumPublie: true,
                preselectionsPubliees: false,
            },
        });
        return {
            id: resultat.id,
            hackathonId: resultat.hackathonId,
            premierPlace: resultat.premierPlace,
            deuxiemePlace: resultat.deuxiemePlace,
            troisiemePlace: resultat.troisiemePlace,
            podiumPublie: resultat.podiumPublie,
        };
    }
    async publishPreselections(hackathonId, preselectionnes) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id: hackathonId },
        });
        if (!hackathon)
            throw new common_1.NotFoundException(`Hackathon avec l'ID ${hackathonId} non trouvé`);
        const preselectionnesJson = Array.isArray(preselectionnes)
            ? preselectionnes
            : [];
        const resultat = await this.prisma.resultats.upsert({
            where: { hackathonId },
            update: {
                preselectionnes: preselectionnesJson,
                preselectionsPubliees: true,
            },
            create: {
                hackathonId,
                preselectionnes: preselectionnesJson,
                preselectionsPubliees: true,
                podiumPublie: false,
            },
        });
        const preselectionnesArray = Array.isArray(resultat.preselectionnes)
            ? resultat.preselectionnes
            : [];
        try {
            if (preselectionnesArray.length > 0) {
                const users = await this.prisma.user.findMany({
                    where: { email: { in: preselectionnesArray } },
                    select: { email: true, nom: true, prenom: true },
                });
                for (const user of users) {
                    const html = `
            <h2>Félicitations, vous êtes présélectionné(e) ! 🎉</h2>
            <p>Bonjour <strong>${user.prenom} ${user.nom}</strong>,</p>
            <p>
              Nous avons le plaisir de vous informer que vous êtes présélectionné(e) pour la prochaine phase du Hackathon CFI-CIRAS.
              Votre candidature s’est distinguée et nous vous invitons à poursuivre l’aventure.
            </p>
            <p>
              <strong>Prochaine étape :</strong><br/>
              - Confirmez votre disponibilité pour les dates prévues.<br/>
              - Préparez vos supports (pitch, prototype, démo) si nécessaire.<br/>
              - Surveillez vos emails : nous enverrons bientôt le planning détaillé et les accès.
            </p>
            <p>
              <strong>Rappel de vos informations :</strong><br/>
              - Nom : ${user.prenom} ${user.nom}<br/>
              - Email : ${user.email}<br/>
            </p>
            <p>
              Si vous ne pouvez pas participer ou si vos informations sont inexactes, merci de nous le signaler en répondant à ce mail.
            </p>
            <p>
              Cordialement,<br/>
              L’équipe d’organisation du Hackathon CFI-CIRAS<br/>
              (noreply)
            </p>
          `;
                    await this.emailService.sendEmail(user.email, 'Félicitations, vous êtes présélectionné(e) !', html);
                }
            }
        }
        catch (error) {
            console.error('Erreur envoi emails présélectionnés:', error);
        }
        return {
            id: resultat.id,
            hackathonId: resultat.hackathonId,
            preselectionnes: preselectionnesArray,
            preselectionsPubliees: resultat.preselectionsPubliees,
        };
    }
    async unpublishPodium(hackathonId) {
        const resultat = await this.prisma.resultats.findUnique({
            where: { hackathonId },
        });
        if (!resultat)
            throw new common_1.NotFoundException(`Aucun résultat trouvé pour le hackathon ${hackathonId}`);
        return this.prisma.resultats.update({
            where: { hackathonId },
            data: { podiumPublie: false },
        });
    }
    async unpublishPreselections(hackathonId) {
        const resultat = await this.prisma.resultats.findUnique({
            where: { hackathonId },
        });
        if (!resultat)
            throw new common_1.NotFoundException(`Aucun résultat trouvé pour le hackathon ${hackathonId}`);
        return this.prisma.resultats.update({
            where: { hackathonId },
            data: { preselectionsPubliees: false },
        });
    }
    async getPublicResultats() {
        let hackathon = await this.prisma.hackathon.findFirst({
            where: {
                status: { in: [client_1.HackathonStatus.UPCOMING, client_1.HackathonStatus.ONGOING] },
            },
            orderBy: { dateDebut: 'asc' },
        });
        if (!hackathon) {
            hackathon = await this.prisma.hackathon.findFirst({
                where: { status: client_1.HackathonStatus.PAST },
                orderBy: { dateFin: 'desc' },
            });
        }
        if (!hackathon) {
            return {
                hackathonId: null,
                podiumPublie: false,
                preselectionsPubliees: false,
                premierPlace: null,
                deuxiemePlace: null,
                troisiemePlace: null,
                preselectionnes: [],
                documentPreselectionsName: null,
                hasPreselectionsDocument: false,
            };
        }
        const resultats = await this.getResultats(hackathon.id);
        const preselectionnesArray = Array.isArray(resultats.preselectionnes)
            ? resultats.preselectionnes
            : [];
        return {
            ...resultats,
            hackathonId: hackathon.id,
            preselectionnes: preselectionnesArray,
            documentPreselectionsName: resultats.documentPreselectionsName || null,
            hasPreselectionsDocument: !!resultats.documentPreselectionsName,
        };
    }
    async uploadPreselectionsDocument(hackathonId, file) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id: hackathonId },
        });
        if (!hackathon)
            throw new common_1.NotFoundException(`Hackathon avec l'ID ${hackathonId} non trouvé`);
        if (file.mimetype !== 'application/pdf') {
            throw new common_1.BadRequestException('Le fichier doit être un PDF');
        }
        try {
            const ext = path.extname(file.originalname) || '.pdf';
            const fileName = `preselections-${hackathonId}-${Date.now()}${ext}`;
            const filePath = path.join(this.uploadsDir, fileName);
            fs.writeFileSync(filePath, file.buffer);
            console.log(`📄 Extraction des participants depuis le PDF...`);
            const extractedParticipants = await this.pdfExtractionService.extractParticipantsFromPdf(file.buffer);
            console.log(`📊 ${extractedParticipants.length} participants extraits du PDF`);
            console.log(`👥 Récupération des inscrits au hackathon ${hackathonId}...`);
            const inscriptions = await this.prisma.inscription.findMany({
                where: {
                    hackathonId,
                    user: { role: { not: client_1.Role.ADMIN } },
                },
                include: { user: true },
            });
            console.log(`📋 ${inscriptions.length} inscriptions trouvées`);
            const users = inscriptions.map((ins) => ({
                id: ins.user.id,
                email: ins.user.email,
                nom: ins.user.nom,
                prenom: ins.user.prenom,
            }));
            console.log(`👤 ${users.length} utilisateurs inscrits (admins exclus)`);
            console.log(`🔗 Début du matching...`);
            const matchedEmails = this.pdfExtractionService.matchParticipantsWithUsers(extractedParticipants, users);
            console.log(`✅ ${matchedEmails.length} correspondances trouvées`);
            const extractedEmails = extractedParticipants
                .map((p) => (p.email || '').trim())
                .filter(Boolean);
            const unmatchedEmails = extractedEmails.filter((e) => !matchedEmails.some((m) => m.toLowerCase() === e.toLowerCase()));
            const resultat = await this.prisma.resultats.upsert({
                where: { hackathonId },
                update: {
                    documentPreselectionsName: file.originalname,
                    documentPreselectionsUploadedAt: new Date(),
                    preselectionnes: matchedEmails,
                },
                create: {
                    hackathonId,
                    documentPreselectionsName: file.originalname,
                    documentPreselectionsUploadedAt: new Date(),
                    preselectionnes: matchedEmails,
                    podiumPublie: false,
                    preselectionsPubliees: false,
                },
            });
            return {
                id: resultat.id,
                hackathonId: resultat.hackathonId,
                documentName: file.originalname,
                extractedCount: extractedParticipants.length,
                matchedCount: matchedEmails.length,
                preselectionnes: matchedEmails,
                extractedEmails: extractedEmails.slice(0, 200),
                unmatchedEmails: unmatchedEmails.slice(0, 200),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error instanceof Error
                ? error.message
                : 'Erreur lors du traitement du PDF');
        }
    }
    async getPreselectionsDocument(hackathonId) {
        const resultat = await this.prisma.resultats.findUnique({
            where: { hackathonId },
        });
        if (!resultat?.documentPreselectionsName)
            throw new common_1.NotFoundException('Document PDF non trouvé pour ce hackathon');
        if (!fs.existsSync(resultat.documentPreselectionsName)) {
            throw new common_1.NotFoundException("Le fichier PDF n'existe plus sur le serveur");
        }
        return {
            path: resultat.documentPreselectionsName,
            name: resultat.documentPreselectionsName || 'document.pdf',
            buffer: fs.readFileSync(resultat.documentPreselectionsName),
        };
    }
    async deletePreselectionsDocument(hackathonId) {
        const resultat = await this.prisma.resultats.findUnique({
            where: { hackathonId },
        });
        if (!resultat?.documentPreselectionsName)
            throw new common_1.NotFoundException('Document PDF non trouvé pour ce hackathon');
        if (fs.existsSync(resultat.documentPreselectionsName)) {
            fs.unlinkSync(resultat.documentPreselectionsName);
        }
        return this.prisma.resultats.update({
            where: { hackathonId },
            data: {
                documentPreselectionsName: null,
                documentPreselectionsUploadedAt: null,
            },
        });
    }
    async generateInscriptionsListPdf() {
        const hackathon = await this.prisma.hackathon.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        const inscriptions = await this.prisma.inscription.findMany({
            where: {
                statut: 'VALIDE',
                user: { role: { not: client_1.Role.ADMIN } },
            },
            include: {
                user: { select: { id: true, email: true, nom: true, prenom: true, role: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        const formatted = inscriptions.map((ins) => ({
            id: ins.id,
            nom: ins.user.nom,
            prenom: ins.user.prenom,
            email: ins.user.email,
            promo: ins.promo || null,
            classe: (() => {
                const tech = ins.technologies;
                if (!tech)
                    return null;
                if (Array.isArray(tech)) {
                    const first = tech.find((t) => typeof t === 'string' && t.trim().length > 0);
                    return first || null;
                }
                if (typeof tech === 'object' && typeof tech.classe === 'string' && tech.classe.trim().length > 0) {
                    return tech.classe;
                }
                return null;
            })(),
            statut: ins.statut,
            createdAt: ins.createdAt,
        }));
        return this.pdfGenerationService.generateInscriptionsListPdf(formatted, hackathon?.nom || 'Hackathon');
    }
};
exports.ResultatsService = ResultatsService;
exports.ResultatsService = ResultatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pdf_extraction_service_1.PdfExtractionService,
        pdf_generation_service_1.PdfGenerationService,
        email_service_1.EmailService])
], ResultatsService);
//# sourceMappingURL=resultats.service.js.map