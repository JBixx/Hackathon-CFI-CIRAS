"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHackathonDtoSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.UpdateHackathonDtoSchema = zod_1.z
    .object({
    nom: zod_1.z.string().min(1, 'Le nom est requis').optional(),
    description: zod_1.z.string().min(1, 'La description est requise').optional(),
    dateDebut: zod_1.z.coerce.date().optional(),
    dateFin: zod_1.z.coerce.date().optional(),
    dateLimiteInscription: zod_1.z.coerce.date().optional(),
    status: zod_1.z.nativeEnum(client_1.HackathonStatus).optional(),
})
    .refine((data) => {
    if (data.dateDebut && data.dateFin) {
        return data.dateFin > data.dateDebut;
    }
    return true;
}, {
    message: 'La date de fin doit être après la date de début',
    path: ['dateFin'],
});
//# sourceMappingURL=update-hackathon.dto.zod.js.map