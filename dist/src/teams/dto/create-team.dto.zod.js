"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTeamDtoSchema = void 0;
const zod_1 = require("zod");
exports.CreateTeamDtoSchema = zod_1.z.object({
    nom: zod_1.z.string().min(1, 'Le nom est requis'),
    description: zod_1.z.string().optional(),
    projetNom: zod_1.z.string().optional(),
});
//# sourceMappingURL=create-team.dto.zod.js.map