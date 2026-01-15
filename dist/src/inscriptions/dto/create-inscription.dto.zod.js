"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInscriptionDtoSchema = void 0;
const zod_1 = require("zod");
exports.CreateInscriptionDtoSchema = zod_1.z.object({
    hackathonId: zod_1.z.string().uuid("L'ID du hackathon doit être un UUID valide"),
});
//# sourceMappingURL=create-inscription.dto.zod.js.map