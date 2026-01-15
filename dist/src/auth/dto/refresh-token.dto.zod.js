"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenDtoSchema = void 0;
const zod_1 = require("zod");
exports.RefreshTokenDtoSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Le refresh token est requis'),
});
//# sourceMappingURL=refresh-token.dto.zod.js.map