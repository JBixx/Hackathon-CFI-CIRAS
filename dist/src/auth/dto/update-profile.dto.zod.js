"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDtoSchema = void 0;
const zod_1 = require("zod");
exports.UpdateProfileDtoSchema = zod_1.z.object({
    nom: zod_1.z.string().min(1, 'Le nom est requis').optional(),
    prenom: zod_1.z.string().min(1, 'Le prénom est requis').optional(),
    promo: zod_1.z.string().optional(),
    technologies: zod_1.z.array(zod_1.z.string()).optional(),
});
//# sourceMappingURL=update-profile.dto.zod.js.map