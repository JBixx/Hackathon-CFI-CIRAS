"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HackathonQueryDtoSchema = void 0;
const zod_1 = require("zod");
exports.HackathonQueryDtoSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).optional().default(10),
    year: zod_1.z.coerce.number().int().optional(),
});
//# sourceMappingURL=hackathon-query.dto.zod.js.map