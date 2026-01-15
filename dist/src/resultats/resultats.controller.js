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
exports.ResultatsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const multer_1 = require("multer");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const resultats_service_1 = require("./resultats.service");
let ResultatsController = class ResultatsController {
    resultatsService;
    constructor(resultatsService) {
        this.resultatsService = resultatsService;
    }
    async getPublicResultats() {
        return this.resultatsService.getPublicResultats();
    }
    async getResultats(hackathonId) {
        return this.resultatsService.getResultats(hackathonId);
    }
    async publishPodium(hackathonId, data) {
        return this.resultatsService.publishPodium(hackathonId, data);
    }
    async unpublishPodium(hackathonId) {
        return this.resultatsService.unpublishPodium(hackathonId);
    }
    async publishPreselections(hackathonId, data) {
        return this.resultatsService.publishPreselections(hackathonId, data.preselectionnes);
    }
    async unpublishPreselections(hackathonId) {
        return this.resultatsService.unpublishPreselections(hackathonId);
    }
    async uploadPreselectionsDocument(hackathonId, file) {
        if (!file)
            throw new common_1.BadRequestException('Aucun fichier fourni');
        return this.resultatsService.uploadPreselectionsDocument(hackathonId, file);
    }
    async downloadPreselectionsDocument(hackathonId, res) {
        const doc = await this.resultatsService.getPreselectionsDocument(hackathonId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${doc.name}"`);
        res.send(doc.buffer);
    }
    async deletePreselectionsDocument(hackathonId) {
        return this.resultatsService.deletePreselectionsDocument(hackathonId);
    }
    async generateInscriptionsListPdf(hackathonId, res) {
        const pdfBuffer = await this.resultatsService.generateInscriptionsListPdf();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="liste-inscrits.pdf"`);
        res.send(pdfBuffer);
    }
};
exports.ResultatsController = ResultatsController;
__decorate([
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({
        summary: 'Récupérer les résultats publics du hackathon actuel',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Résultats publics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResultatsController.prototype, "getPublicResultats", null);
__decorate([
    (0, common_1.Get)('hackathon/:hackathonId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les résultats d'un hackathon (Admin)" }),
    __param(0, (0, common_1.Param)('hackathonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResultatsController.prototype, "getResultats", null);
__decorate([
    (0, common_1.Post)('hackathon/:hackathonId/podium'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Publier le podium (Admin)' }),
    __param(0, (0, common_1.Param)('hackathonId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResultatsController.prototype, "publishPodium", null);
__decorate([
    (0, common_1.Delete)('hackathon/:hackathonId/podium'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Dépublier le podium (Admin)' }),
    __param(0, (0, common_1.Param)('hackathonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResultatsController.prototype, "unpublishPodium", null);
__decorate([
    (0, common_1.Post)('hackathon/:hackathonId/preselections'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Publier les présélections (Admin)' }),
    __param(0, (0, common_1.Param)('hackathonId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResultatsController.prototype, "publishPreselections", null);
__decorate([
    (0, common_1.Delete)('hackathon/:hackathonId/preselections'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Dépublier les présélections (Admin)' }),
    __param(0, (0, common_1.Param)('hackathonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResultatsController.prototype, "unpublishPreselections", null);
__decorate([
    (0, common_1.Post)('hackathon/:hackathonId/preselections/document'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'application/pdf')
                cb(null, true);
            else
                cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
        },
    })),
    (0, swagger_1.ApiOperation)({
        summary: 'Uploader un PDF des présélections + extraction auto (Admin)',
    }),
    __param(0, (0, common_1.Param)('hackathonId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResultatsController.prototype, "uploadPreselectionsDocument", null);
__decorate([
    (0, common_1.Get)('hackathon/:hackathonId/preselections/document'),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Télécharger le PDF des présélections (Public)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PDF',
        content: { 'application/pdf': {} },
    }),
    __param(0, (0, common_1.Param)('hackathonId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResultatsController.prototype, "downloadPreselectionsDocument", null);
__decorate([
    (0, common_1.Delete)('hackathon/:hackathonId/preselections/document'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer le PDF des présélections (Admin)' }),
    __param(0, (0, common_1.Param)('hackathonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResultatsController.prototype, "deletePreselectionsDocument", null);
__decorate([
    (0, common_1.Get)('hackathon/:hackathonId/inscriptions/liste-pdf'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Générer un PDF de tous les inscrits (Admin)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PDF',
        content: { 'application/pdf': {} },
    }),
    __param(0, (0, common_1.Param)('hackathonId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResultatsController.prototype, "generateInscriptionsListPdf", null);
exports.ResultatsController = ResultatsController = __decorate([
    (0, swagger_1.ApiTags)('resultats'),
    (0, common_1.Controller)('resultats'),
    __metadata("design:paramtypes", [resultats_service_1.ResultatsService])
], ResultatsController);
//# sourceMappingURL=resultats.controller.js.map