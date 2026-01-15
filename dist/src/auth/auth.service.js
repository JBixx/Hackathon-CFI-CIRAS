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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const queue_service_1 = require("../queue/queue.service");
const client_1 = require("@prisma/client");
const events_gateway_1 = require("../events/events.gateway");
let AuthService = class AuthService {
    prisma;
    jwtService;
    queueService;
    eventsGateway;
    constructor(prisma, jwtService, queueService, eventsGateway) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.queueService = queueService;
        this.eventsGateway = eventsGateway;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role,
            },
        };
    }
    async register(registerDto) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id: registerDto.hackathonId },
        });
        if (!hackathon) {
            throw new common_1.NotFoundException(`Hackathon avec l'ID ${registerDto.hackathonId} non trouvé`);
        }
        const maintenant = new Date();
        if (new Date(hackathon.dateLimiteInscription) < maintenant) {
            throw new common_1.BadRequestException("La date limite d'inscription est dépassée");
        }
        if (hackathon.status === client_1.HackathonStatus.PAST) {
            throw new common_1.BadRequestException('Ce hackathon est déjà terminé');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });
        let user;
        if (existingUser) {
            const existingInscription = await this.prisma.inscription.findUnique({
                where: {
                    userId_hackathonId: {
                        userId: existingUser.id,
                        hackathonId: registerDto.hackathonId,
                    },
                },
            });
            if (existingInscription) {
                throw new common_1.BadRequestException('Vous êtes déjà inscrit à ce hackathon');
            }
            user = existingUser;
        }
        else {
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            user = await this.prisma.user.create({
                data: {
                    email: registerDto.email,
                    password: hashedPassword,
                    nom: registerDto.nom,
                    prenom: registerDto.prenom,
                    role: 'USER',
                },
            });
        }
        const inscription = await this.prisma.inscription.create({
            data: {
                userId: user.id,
                hackathonId: registerDto.hackathonId,
                promo: registerDto.promo,
                technologies: registerDto.technologies
                    ? registerDto.technologies
                    : undefined,
                statut: 'VALIDE',
            },
        });
        await this.queueService.addEmailJob('accus_reception', {
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            promo: registerDto.promo,
            technologies: registerDto.technologies,
            hackathon: {
                id: hackathon.id,
                nom: hackathon.nom,
                description: hackathon.description,
                dateDebut: hackathon.dateDebut,
                dateFin: hackathon.dateFin,
                dateLimiteInscription: hackathon.dateLimiteInscription,
                registrationGoal: hackathon.registrationGoal,
                currentRegistrations: hackathon.currentRegistrations,
                status: hackathon.status,
            },
        });
        this.eventsGateway.emitNewInscription({
            userId: user.id,
            hackathonId: registerDto.hackathonId,
            inscriptionId: inscription.id,
            userEmail: user.email,
            userName: `${user.prenom} ${user.nom}`,
        });
        const { password: _, ...userResult } = user;
        return {
            user: userResult,
            inscription: {
                id: inscription.id,
                hackathonId: inscription.hackathonId,
                promo: inscription.promo,
                technologies: inscription.technologies,
                statut: inscription.statut,
                createdAt: inscription.createdAt,
            },
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                nom: true,
                prenom: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async updateProfile(userId, updateDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(updateDto.nom && { nom: updateDto.nom }),
                ...(updateDto.prenom && { prenom: updateDto.prenom }),
            },
            select: {
                id: true,
                email: true,
                nom: true,
                prenom: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Mot de passe actuel incorrect');
        }
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { message: 'Mot de passe changé avec succès' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => events_gateway_1.EventsGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        queue_service_1.QueueService,
        events_gateway_1.EventsGateway])
], AuthService);
//# sourceMappingURL=auth.service.js.map