"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHackathonDtoSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.CreateHackathonDtoSchema = zod_1.z
    .object({
    nom: zod_1.z.string().min(1, 'Le nom est requis'),
    description: zod_1.z.string().min(1, 'La description est requise'),
    dateDebut: zod_1.z.coerce.date(),
    dateFin: zod_1.z.coerce.date(),
    dateLimiteInscription: zod_1.z.coerce.date(),
    status: zod_1.z.nativeEnum(client_1.HackathonStatus).optional(),
})
    .refine((data) => data.dateFin > data.dateDebut, {
    message: 'La date de fin doit être après la date de début',
    path: ['dateFin'],
})
    .refine((data) => data.dateLimiteInscription <= data.dateDebut, {
    message: "La date limite d'inscription doit être avant ou égale à la date de début",
    path: ['dateLimiteInscription'],
});
//# sourceMappingURL=create-hackathon.dto.zod.js.map