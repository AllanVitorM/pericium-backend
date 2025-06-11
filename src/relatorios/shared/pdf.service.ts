import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as streamifier from 'streamifier';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { RelatorioDocument } from '../relatorio.schema';

@Injectable()
export class PdfService {
  async gerarRelatorioPDF(relatorio: RelatorioDocument): Promise<string> {
    const doc = new PDFDocument();
    const buffers: Uint8Array[] = [];

    doc.on('data', (chunk: Uint8Array) => buffers.push(chunk));

    doc
      .font('Times-Bold')
      .fontSize(22)
      .text('RELATORIO PERICIAL TÉCNICO', { align: 'center' })
      .moveDown(2);

    doc
      .fontSize(12)
      .font('Times-Roman')
      .text(`Nº do Relatório: ${relatorio._id}`, { align: 'left' })
      .text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`)
      .moveDown();

    doc
      .font('Times-Bold')
      .fontSize(14)
      .text('Título:', { underline: true })
      .moveDown(0.2)
      .font('Times-Roman')
      .fontSize(12)
      .text(relatorio.title)
      .moveDown();

    doc
      .font('Times-Bold')
      .fontSize(14)
      .text('Descrição:', { underline: true })
      .moveDown(0.2)
      .font('Times-Roman')
      .fontSize(12)
      .text(relatorio.description || 'Sem descrição disponível')
      .moveDown(2);

    if (relatorio.assinado && relatorio.peritoAssinante && relatorio.dataAssinatura) {
      doc
        .font('Times-Roman')
        .fontSize(12)
        .text(`Assinado por: ${relatorio.peritoAssinante}`, { align: 'center' }) // Aqui pode ser substituído pelo `name`, se populado
        .text('____________________________________', { align: 'center' })
        .text(`Assinado em: ${new Date(relatorio.dataAssinatura).toLocaleDateString('pt-BR')}`, {
          align: 'center',
        });
    }

    doc.end();

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err: Error) =>
        reject(new Error(`Erro ao gerar PDF: ${err.message}`)),
      );
    });

    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'relatorios',
          public_id: `relatorio-${relatorio._id}`,
          format: 'pdf',
        },
        (err, result) => {
          if (err) return reject(new Error(`Erro no upload: ${err.message}`));
          resolve(result as UploadApiResponse);
        },
      );
      const readStream = streamifier.createReadStream(buffer);
      readStream.pipe(stream);
    });

    return uploadResult.secure_url;
  }
}
