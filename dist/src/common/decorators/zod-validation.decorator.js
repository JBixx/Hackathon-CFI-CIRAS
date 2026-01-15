"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodValidation = void 0;
exports.UseZodValidation = UseZodValidation;
const common_1 = require("@nestjs/common");
const zod_validation_pipe_1 = require("../pipes/zod-validation.pipe");
function UseZodValidation(schema) {
    return (0, common_1.applyDecorators)((0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(schema)));
}
exports.ZodValidation = UseZodValidation;
//# sourceMappingURL=zod-validation.decorator.js.map