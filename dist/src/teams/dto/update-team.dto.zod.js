"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTeamDtoSchema = void 0;
const zod_1 = require("zod");
exports.UpdateTeamDtoSchema = zod_1.z.object({
    nom: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    projetNom: zod_1.z.string().nullable().optional(),
});
//# sourceMappingURL=update-team.dto.zod.js.map