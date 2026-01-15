"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDtoSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.UpdateUserDtoSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email invalide').optional(),
    nom: zod_1.z.string().min(1, 'Le nom est requis').optional(),
    prenom: zod_1.z.string().min(1, 'Le prénom est requis').optional(),
    promo: zod_1.z.string().optional().nullable(),
    technologies: zod_1.z.array(zod_1.z.string()).optional(),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
});
//# sourceMappingURL=update-user.dto.zod.js.map