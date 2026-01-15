"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMemberDtoSchema = void 0;
const zod_1 = require("zod");
exports.AddMemberDtoSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "L'utilisateur est requis"),
    role: zod_1.z.string().optional(),
});
//# sourceMappingURL=add-member.dto.zod.js.map