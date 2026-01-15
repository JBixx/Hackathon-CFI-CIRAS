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
exports.InscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inscriptions_service_1 = require("./inscriptions.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let InscriptionsController = class InscriptionsController {
    inscriptionsService;
    constructor(inscriptionsService) {
        this.inscriptionsService = inscriptionsService;
    }
    async getMyInscriptions(req) {
        return this.inscriptionsService.getMyInscriptions(req.user.id);
    }
    async getInscriptionById(id, req) {
        return this.inscriptionsService.getInscriptionById(id, req.user.id, req.user.role);
    }
    async deleteInscription(id, req) {
        return this.inscriptionsService.deleteInscription(id, req.user.id, req.user.role);
    }
};
exports.InscriptionsController = InscriptionsController;
__decorate([
    (0, common_1.Get)('mes-inscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer mes inscriptions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Liste des inscriptions de l'utilisateur",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InscriptionsController.prototype, "getMyInscriptions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'inscription" }),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les détails d'une inscription" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Détails de l'inscription" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inscription non trouvée' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InscriptionsController.prototype, "getInscriptionById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'inscription" }),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une inscription' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inscription supprimée avec succès',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inscription non trouvée' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InscriptionsController.prototype, "deleteInscription", null);
exports.InscriptionsController = InscriptionsController = __decorate([
    (0, swagger_1.ApiTags)('inscriptions'),
    (0, common_1.Controller)('inscriptions'),
    __metadata("design:paramtypes", [inscriptions_service_1.InscriptionsService])
], InscriptionsController);
//# sourceMappingURL=inscriptions.controller.js.map