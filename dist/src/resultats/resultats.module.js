"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultatsModule = void 0;
const common_1 = require("@nestjs/common");
const resultats_controller_1 = require("./resultats.controller");
const resultats_service_1 = require("./resultats.service");
const pdf_extraction_service_1 = require("./pdf-extraction.service");
const pdf_generation_service_1 = require("./pdf-generation.service");
const prisma_module_1 = require("../prisma/prisma.module");
const email_module_1 = require("../email/email.module");
let ResultatsModule = class ResultatsModule {
};
exports.ResultatsModule = ResultatsModule;
exports.ResultatsModule = ResultatsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, email_module_1.EmailModule],
        controllers: [resultats_controller_1.ResultatsController],
        providers: [resultats_service_1.ResultatsService, pdf_extraction_service_1.PdfExtractionService, pdf_generation_service_1.PdfGenerationService],
        exports: [resultats_service_1.ResultatsService, pdf_extraction_service_1.PdfExtractionService, pdf_generation_service_1.PdfGenerationService],
    })
], ResultatsModule);
//# sourceMappingURL=resultats.module.js.map