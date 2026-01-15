"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalValidationPipe = void 0;
const common_1 = require("@nestjs/common");
let ConditionalValidationPipe = class ConditionalValidationPipe extends common_1.ValidationPipe {
    constructor(options) {
        super(options);
    }
    transform(value, metadata) {
        if (metadata.type === 'body' && typeof value === 'string') {
            try {
                const trimmed = value.trim();
                if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                    value = JSON.parse(trimmed);
                }
            }
            catch {
            }
        }
        if (metadata.type === 'body' &&
            (metadata.metatype === Object || metadata.metatype == null)) {
            return value;
        }
        return super.transform(value, metadata);
    }
};
exports.ConditionalValidationPipe = ConditionalValidationPipe;
exports.ConditionalValidationPipe = ConditionalValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], ConditionalValidationPipe);
//# sourceMappingURL=conditional-validation.pipe.js.map