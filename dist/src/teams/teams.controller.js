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
exports.TeamsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const zod_validation_decorator_1 = require("../common/decorators/zod-validation.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const add_member_dto_zod_1 = require("./dto/add-member.dto.zod");
const create_team_dto_zod_1 = require("./dto/create-team.dto.zod");
const update_team_dto_zod_1 = require("./dto/update-team.dto.zod");
const teams_service_1 = require("./teams.service");
let TeamsController = class TeamsController {
    teamsService;
    constructor(teamsService) {
        this.teamsService = teamsService;
    }
    async getPublicTeams() {
        return this.teamsService.getPublicTeams();
    }
    async getTeamsByHackathon(hackathonId) {
        return this.teamsService.getPublicTeamsByHackathon(hackathonId);
    }
    async getAllTeamsByHackathon(hackathonId) {
        return this.teamsService.getTeamsByHackathon(hackathonId);
    }
    async createTeam(hackathonId, payload) {
        return this.teamsService.createTeam(hackathonId, payload);
    }
    async getTeamById(id) {
        return this.teamsService.getTeamById(id);
    }
    async updateTeam(id, payload) {
        return this.teamsService.updateTeam(id, payload);
    }
    async deleteTeam(id) {
        return this.teamsService.deleteTeam(id);
    }
    async addMember(teamId, payload) {
        return this.teamsService.addMemberToTeam(teamId, payload.userId, payload.role);
    }
    async removeMember(teamId, userId) {
        return this.teamsService.removeMemberFromTeam(teamId, userId);
    }
};
exports.TeamsController = TeamsController;
__decorate([
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les équipes publiques' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "getPublicTeams", null);
__decorate([
    (0, common_1.Get)('hackathon/:hackathonId'),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les équipes publiques pour un hackathon' }),
    __param(0, (0, common_1.Param)('hackathonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "getTeamsByHackathon", null);
__decorate([
    (0, common_1.Get)('admin/hackathon/:hackathonId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les équipes pour un hackathon (Admin)' }),
    __param(0, (0, common_1.Param)('hackathonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "getAllTeamsByHackathon", null);
__decorate([
    (0, common_1.Post)('hackathon/:hackathonId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'hackathonId', description: 'ID du hackathon' }),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une équipe (Admin)' }),
    (0, zod_validation_decorator_1.ZodValidation)(create_team_dto_zod_1.CreateTeamDtoSchema),
    __param(0, (0, common_1.Param)('hackathonId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "createTeam", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'équipe" }),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une équipe (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "getTeamById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'équipe" }),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une équipe (Admin)' }),
    (0, zod_validation_decorator_1.ZodValidation)(update_team_dto_zod_1.UpdateTeamDtoSchema),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "updateTeam", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'équipe" }),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une équipe (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "deleteTeam", null);
__decorate([
    (0, common_1.Post)(':teamId/members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'teamId', description: "ID de l'équipe" }),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un membre (Admin)' }),
    (0, zod_validation_decorator_1.ZodValidation)(add_member_dto_zod_1.AddMemberDtoSchema),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':teamId/members/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'teamId', description: "ID de l'équipe" }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: "ID de l'utilisateur" }),
    (0, swagger_1.ApiOperation)({ summary: 'Retirer un membre (Admin)' }),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeamsController.prototype, "removeMember", null);
exports.TeamsController = TeamsController = __decorate([
    (0, swagger_1.ApiTags)('teams'),
    (0, common_1.Controller)('teams'),
    __metadata("design:paramtypes", [teams_service_1.TeamsService])
], TeamsController);
//# sourceMappingURL=teams.controller.js.map