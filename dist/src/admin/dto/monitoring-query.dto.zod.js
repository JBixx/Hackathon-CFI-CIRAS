"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringQueryDtoSchema = void 0;
const zod_1 = require("zod");
exports.MonitoringQueryDtoSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(50),
    type: zod_1.z.string().optional(),
});
//# sourceMappingURL=monitoring-query.dto.zod.js.map