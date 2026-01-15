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
exports.HackathonController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hackathon_service_1 = require("./hackathon.service");
const hackathon_query_dto_zod_1 = require("./dto/hackathon-query.dto.zod");
const create_hackathon_dto_zod_1 = require("./dto/create-hackathon.dto.zod");
const update_hackathon_dto_zod_1 = require("./dto/update-hackathon.dto.zod");
const zod_validation_decorator_1 = require("../common/decorators/zod-validation.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let HackathonController = class HackathonController {
    hackathonService;
    constructor(hackathonService) {
        this.hackathonService = hackathonService;
    }
    async getPublicHackathon() {
        return this.hackathonService.getPublicHackathon();
    }
    async getAvailableHackathons() {
        return this.hackathonService.getAvailableHackathons();
    }
    async getPastHackathons(query) {
        return this.hackathonService.getPastHackathons(query.page || 1, query.limit || 10, query.year);
    }
    async getHackathonById(id) {
        return this.hackathonService.getHackathonById(id);
    }
    async createHackathon(createDto) {
        return this.hackathonService.createHackathon(createDto);
    }
    async updateHackathon(id, updateDto) {
        return this.hackathonService.updateHackathon(id, updateDto);
    }
    async deleteHackathon(id) {
        return this.hackathonService.deleteHackathon(id);
    }
};
exports.HackathonController = HackathonController;
__decorate([
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les informations du hackathon public actuel',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Informations du hackathon avec compte à rebours',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Aucun hackathon à venir trouvé' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "getPublicHackathon", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer tous les hackathons disponibles pour inscription',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des hackathons disponibles (UPCOMING ou ONGOING) avec date limite non dépassée',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "getAvailableHackathons", null);
__decorate([
    (0, common_1.Get)('past'),
    (0, zod_validation_decorator_1.ZodValidation)(hackathon_query_dto_zod_1.HackathonQueryDtoSchema),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer la liste des hackathons passés avec pagination',
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
        description: "Nombre d'éléments par page (défaut: 10)",
    }),
    (0, swagger_1.ApiQuery)({
        name: 'year',
        required: false,
        type: Number,
        description: 'Filtrer par année',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des hackathons passés avec métadonnées de pagination',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "getPastHackathons", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les détails d'un hackathon" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Détails du hackathon' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hackathon non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "getHackathonById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, zod_validation_decorator_1.ZodValidation)(create_hackathon_dto_zod_1.CreateHackathonDtoSchema),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau hackathon (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Hackathon créé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé - Admin uniquement' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "createHackathon", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, zod_validation_decorator_1.ZodValidation)(update_hackathon_dto_zod_1.UpdateHackathonDtoSchema),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un hackathon (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hackathon modifié avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hackathon non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "updateHackathon", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un hackathon (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hackathon supprimé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hackathon non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HackathonController.prototype, "deleteHackathon", null);
exports.HackathonController = HackathonController = __decorate([
    (0, swagger_1.ApiTags)('hackathons'),
    (0, common_1.Controller)('hackathons'),
    __metadata("design:paramtypes", [hackathon_service_1.HackathonService])
], HackathonController);
//# sourceMappingURL=hackathon.controller.js.map