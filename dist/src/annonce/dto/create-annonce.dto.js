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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAnnonceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateAnnonceDto {
    titre;
    contenu;
    cible;
    hackathonId;
}
exports.CreateAnnonceDto = CreateAnnonceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nouvelle annonce importante' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "titre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Contenu de l'annonce..." }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "contenu", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AnnonceCible, example: client_1.AnnonceCible.PUBLIC }),
    (0, class_validator_1.IsEnum)(client_1.AnnonceCible),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "cible", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAnnonceDto.prototype, "hackathonId", void 0);
//# sourceMappingURL=create-annonce.dto.js.map