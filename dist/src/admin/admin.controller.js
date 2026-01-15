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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const annonce_service_1 = require("../annonce/annonce.service");
const create_annonce_dto_zod_1 = require("../annonce/dto/create-annonce.dto.zod");
const zod_validation_decorator_1 = require("../common/decorators/zod-validation.decorator");
let AdminController = class AdminController {
    adminService;
    annonceService;
    constructor(adminService, annonceService) {
        this.adminService = adminService;
        this.annonceService = annonceService;
    }
    async createAnnonce(createAnnonceDto, req) {
        return this.annonceService.create(createAnnonceDto, req.user.id);
    }
    async getDashboard() {
        return this.adminService.getDashboard();
    }
    async getAllInscriptions(page, limit) {
        return this.adminService.getAllInscriptions(page, limit);
    }
    async getMonitoringLogs(page, limit, type) {
        return this.adminService.getMonitoringLogs(page, limit, type);
    }
    async getMetrics() {
        return this.adminService.getMetrics();
    }
    async updateInscription(id, updateDto) {
        return this.adminService.updateInscription(id, updateDto);
    }
    async deleteInscription(id) {
        return this.adminService.deleteInscription(id);
    }
    async getAllUsers(page, limit) {
        return this.adminService.getAllUsers(page, limit);
    }
    async updateUser(id, updateDto) {
        return this.adminService.updateUser(id, updateDto);
    }
    async deleteUser(id) {
        return this.adminService.deleteUser(id);
    }
    async getProfile(req) {
        return this.adminService.getUserProfile(req.user.id);
    }
    async updateProfile(req, updateData) {
        return this.adminService.updateUserProfile(req.user.id, updateData);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('annonces'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, zod_validation_decorator_1.ZodValidation)(create_annonce_dto_zod_1.CreateAnnonceDtoSchema),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle annonce (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Annonce créée avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - Admin uniquement' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hackathon non trouvé' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createAnnonce", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les statistiques du dashboard (Admin uniquement)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistiques du dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - Admin uniquement' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('inscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Numéro de page (défaut: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: "Nombre d'inscriptions par page (défaut: 50)",
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer toutes les inscriptions avec pagination (Admin uniquement)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste paginée des inscriptions' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - Admin uniquement' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllInscriptions", null);
__decorate([
    (0, common_1.Get)('monitoring/logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les logs IA et événements (Admin uniquement)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Numéro de page (défaut: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: "Nombre d'éléments par page (défaut: 50)",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        type: String,
        description: 'Filtrer par type de log (ex: inscription_analysis)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des logs IA avec métadonnées de pagination',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - Admin uniquement' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMonitoringLogs", null);
__decorate([
    (0, common_1.Get)('monitoring/metrics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les métriques simples (Admin uniquement)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Métriques du système' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - Admin uniquement' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Put)('inscriptions/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'inscription" }),
    (0, swagger_1.ApiOperation)({
        summary: 'Modifier une inscription (Admin uniquement) - Principalement pour changer le statut',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inscription modifiée avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inscription non trouvée' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateInscription", null);
__decorate([
    (0, common_1.Delete)('inscriptions/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'inscription" }),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une inscription (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inscription supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inscription non trouvée' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteInscription", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Numéro de page (défaut: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: "Nombre d'utilisateurs par page (défaut: 50)",
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les utilisateurs avec pagination (Admin uniquement)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste paginée des utilisateurs' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - Admin uniquement' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'utilisateur" }),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un utilisateur (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Utilisateur modifié avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Email déjà utilisé' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'utilisateur" }),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un utilisateur (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Utilisateur supprimé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Impossible de supprimer le dernier administrateur',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le profil de l\'utilisateur connecté' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil récupéré avec succès' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le profil de l\'utilisateur connecté' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil mis à jour avec succès' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateProfile", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        annonce_service_1.AnnonceService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map