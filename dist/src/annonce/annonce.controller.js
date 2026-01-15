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
exports.AnnonceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const annonce_service_1 = require("./annonce.service");
const create_annonce_dto_zod_1 = require("./dto/create-annonce.dto.zod");
const update_annonce_dto_zod_1 = require("./dto/update-annonce.dto.zod");
const zod_validation_decorator_1 = require("../common/decorators/zod-validation.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AnnonceController = class AnnonceController {
    annonceService;
    constructor(annonceService) {
        this.annonceService = annonceService;
    }
    async getPublicAnnonces() {
        return this.annonceService.getPublicAnnonces();
    }
    async getAnnoncesInscrits(req) {
        return this.annonceService.getAnnoncesInscrits(req.user.id);
    }
    async getAllAnnonces() {
        return this.annonceService.getAllAnnonces();
    }
    async getAnnonceById(id) {
        return this.annonceService.getAnnonceById(id);
    }
    async create(createAnnonceDto, req) {
        return this.annonceService.create(createAnnonceDto, req.user.id);
    }
    async updateAnnonce(id, updateDto) {
        return this.annonceService.updateAnnonce(id, updateDto);
    }
    async deleteAnnonce(id) {
        return this.annonceService.deleteAnnonce(id);
    }
};
exports.AnnonceController = AnnonceController;
__decorate([
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les annonces publiques' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des annonces publiques' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "getPublicAnnonces", null);
__decorate([
    (0, common_1.Get)('inscrits'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les annonces pour les utilisateurs inscrits',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des annonces pour inscrits' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "getAnnoncesInscrits", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les annonces (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste de toutes les annonces' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - Admin uniquement' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "getAllAnnonces", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'annonce" }),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les détails d'une annonce" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Détails de l'annonce" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Annonce non trouvée' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "getAnnonceById", null);
__decorate([
    (0, common_1.Post)('admin/annonces'),
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
], AnnonceController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('admin/annonces/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, zod_validation_decorator_1.ZodValidation)(update_annonce_dto_zod_1.UpdateAnnonceDtoSchema),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'annonce" }),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier une annonce (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Annonce modifiée avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Annonce non trouvée' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "updateAnnonce", null);
__decorate([
    (0, common_1.Delete)('admin/annonces/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'annonce" }),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une annonce (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Annonce supprimée avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Annonce non trouvée' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "deleteAnnonce", null);
exports.AnnonceController = AnnonceController = __decorate([
    (0, swagger_1.ApiTags)('annonces'),
    (0, common_1.Controller)('annonces'),
    __metadata("design:paramtypes", [annonce_service_1.AnnonceService])
], AnnonceController);
//# sourceMappingURL=annonce.controller.js.map