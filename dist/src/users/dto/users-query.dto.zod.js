"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersQueryDtoSchema = void 0;
const zod_1 = require("zod");
exports.UsersQueryDtoSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(10),
    role: zod_1.z.enum(['USER', 'ADMIN']).optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=users-query.dto.zod.js.map