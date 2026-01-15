"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordDtoSchema = void 0;
const zod_1 = require("zod");
exports.ChangePasswordDtoSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: zod_1.z
        .string()
        .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
});
//# sourceMappingURL=change-password.dto.zod.js.map