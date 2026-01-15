"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDtoSchema = void 0;
const zod_1 = require("zod");
exports.RegisterDtoSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email invalide'),
    password: zod_1.z
        .string()
        .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    nom: zod_1.z.string().min(1, 'Le nom est requis'),
    prenom: zod_1.z.string().min(1, 'Le prénom est requis'),
    promo: zod_1.z.string().optional(),
    technologies: zod_1.z.array(zod_1.z.string()).optional(),
    hackathonId: zod_1.z.string().uuid("L'ID du hackathon doit être un UUID valide"),
});
//# sourceMappingURL=register.dto.zod.js.map