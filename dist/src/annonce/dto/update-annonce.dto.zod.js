"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAnnonceDtoSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.UpdateAnnonceDtoSchema = zod_1.z.object({
    titre: zod_1.z.string().min(1, 'Le titre est requis').optional(),
    contenu: zod_1.z.string().min(1, 'Le contenu est requis').optional(),
    cible: zod_1.z.nativeEnum(client_1.AnnonceCible).optional(),
    hackathonId: zod_1.z
        .string()
        .uuid("L'ID du hackathon doit être un UUID valide")
        .optional()
        .nullable(),
});
//# sourceMappingURL=update-annonce.dto.zod.js.map