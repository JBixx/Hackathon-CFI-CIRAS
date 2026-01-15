"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PdfGenerationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfGenerationService = void 0;
const common_1 = require("@nestjs/common");
let PdfGenerationService = PdfGenerationService_1 = class PdfGenerationService {
    logger = new common_1.Logger(PdfGenerationService_1.name);
    async generateInscriptionsListPdf(inscriptions, hackathonName) {
        return new Promise((resolve, reject) => {
            try {
                const PDFDocument = require('pdfkit');
                const doc = new PDFDocument({ size: 'A4', margin: 50 });
                const buffers = [];
                doc.on('data', (chunk) => buffers.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(buffers)));
                doc.on('error', (err) => {
                    this.logger.error('Erreur génération PDF', err);
                    reject(err);
                });
                doc
                    .fontSize(18)
                    .font('Helvetica-Bold')
                    .text(`Liste des inscrits - ${hackathonName}`, { align: 'center' });
                doc.moveDown(0.5);
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text(`Total: ${inscriptions.length}`, { align: 'center' });
                doc.moveDown(1);
                const margin = 50;
                const rowHeight = 22;
                const pageWidth = doc.page.width;
                const pageHeight = doc.page.height;
                const colWidths = [30, 80, 80, 170, 70, 70];
                const colPositions = [
                    margin,
                    margin + colWidths[0],
                    margin + colWidths[0] + colWidths[1],
                    margin + colWidths[0] + colWidths[1] + colWidths[2],
                    margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
                    margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4]
                ];
                const drawHeader = () => {
                    const y = doc.y;
                    const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
                    const tableHeight = rowHeight;
                    doc
                        .rect(margin, y, tableWidth, tableHeight)
                        .stroke();
                    colPositions.forEach((x, index) => {
                        if (index > 0) {
                            doc
                                .moveTo(x, y)
                                .lineTo(x, y + tableHeight)
                                .stroke();
                        }
                    });
                    doc
                        .fontSize(10)
                        .font('Helvetica-Bold')
                        .text('N°', colPositions[0] + 5, y + 5, { width: colWidths[0] - 10 });
                    doc.text('Nom', colPositions[1] + 5, y + 5, { width: colWidths[1] - 10 });
                    doc.text('Prénom', colPositions[2] + 5, y + 5, { width: colWidths[2] - 10 });
                    doc.text('Email', colPositions[3] + 5, y + 5, { width: colWidths[3] - 10 });
                    doc.text('Classe', colPositions[4] + 5, y + 5, { width: colWidths[4] - 10 });
                    doc.text('Statut', colPositions[5] + 5, y + 5, { width: colWidths[5] - 10 });
                    doc.moveDown(1);
                };
                drawHeader();
                doc.fontSize(9).font('Helvetica');
                inscriptions.forEach((inscription, index) => {
                    if (doc.y > pageHeight - 80) {
                        doc.addPage();
                        drawHeader();
                    }
                    const y = doc.y;
                    const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
                    if (index % 2 === 0) {
                        doc
                            .rect(margin, y - 2, tableWidth, rowHeight)
                            .fill('#F5F5F5')
                            .fillColor('#000000');
                    }
                    doc
                        .rect(margin, y - 2, tableWidth, rowHeight)
                        .stroke();
                    colPositions.forEach((x, colIndex) => {
                        if (colIndex > 0) {
                            doc
                                .moveTo(x, y - 2)
                                .lineTo(x, y - 2 + rowHeight)
                                .stroke();
                        }
                    });
                    const classe = inscription.classe || inscription.promo || '-';
                    const statut = inscription.statut || '-';
                    doc
                        .fontSize(9)
                        .font('Helvetica')
                        .text(String(index + 1), colPositions[0] + 5, y + 2, { width: colWidths[0] - 10 });
                    doc.text((inscription.nom || '-').slice(0, 18), colPositions[1] + 5, y + 2, { width: colWidths[1] - 10 });
                    doc.text((inscription.prenom || '-').slice(0, 18), colPositions[2] + 5, y + 2, { width: colWidths[2] - 10 });
                    doc.text((inscription.email || '-').slice(0, 35), colPositions[3] + 5, y + 2, { width: colWidths[3] - 10 });
                    doc.text(classe.slice(0, 15), colPositions[4] + 5, y + 2, { width: colWidths[4] - 10 });
                    doc.text(statut.slice(0, 15), colPositions[5] + 5, y + 2, { width: colWidths[5] - 10 });
                    doc.moveDown(1);
                });
                const totalPages = doc.bufferedPageRange().count;
                for (let i = 0; i < totalPages; i += 1) {
                    doc.switchToPage(i);
                    doc
                        .fontSize(8)
                        .font('Helvetica')
                        .fillColor('#666666')
                        .text(`Page ${i + 1} sur ${totalPages}`, margin, pageHeight - 30, {
                        align: 'center',
                    });
                }
                doc.end();
            }
            catch (error) {
                this.logger.error('Erreur génération PDF', error);
                reject(error);
            }
        });
    }
};
exports.PdfGenerationService = PdfGenerationService;
exports.PdfGenerationService = PdfGenerationService = PdfGenerationService_1 = __decorate([
    (0, common_1.Injectable)()
], PdfGenerationService);
//# sourceMappingURL=pdf-generation.service.js.map