"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var QueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("../email/email.service");
let QueueService = QueueService_1 = class QueueService {
    emailService;
    logger = new common_1.Logger(QueueService_1.name);
    constructor(emailService) {
        this.emailService = emailService;
        this.logger.log('✅ QueueService initialisé - Mode SMTP direct');
    }
    async addEmailJob(type, data) {
        this.logger.log(`📧 Envoi email direct (${type}) à ${data.email}`);
        const result = await this.sendDirectEmail(type, data);
        if (result) {
            this.logger.log(`✅ Email envoyé avec succès (${type}) à ${data.email}`);
        }
        else {
            this.logger.error(`❌ Échec envoi email (${type}) à ${data.email}`);
        }
        return result;
    }
    async sendDirectEmail(type, data) {
        if (!this.emailService) {
            this.logger.error('EmailService non disponible pour envoi direct');
            return null;
        }
        try {
            switch (type) {
                case 'accus_reception':
                    return await this.emailService.sendAccusReception(data.email, data.nom, data.prenom, data.promo, data.technologies, data.hackathon);
                case 'annonce_inscrits':
                    return await this.emailService.sendAnnonceInscrits(data.email, data.nom, data.prenom, data.titre, data.contenu);
                default:
                    this.logger.warn(`Type d'email non reconnu: ${type}`);
                    return null;
            }
        }
        catch (error) {
            this.logger.error(`Erreur lors de l'envoi de l'email (${type}): ${error?.message || String(error)}`);
            return null;
        }
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = QueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], QueueService);
//# sourceMappingURL=queue.service.js.map