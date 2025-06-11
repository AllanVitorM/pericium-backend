import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class PdfService {
  async gerarRelatorioPDF(relatorio: any): Promise<string> {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.fontSize(20).text('Relatório Técnico', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Título: ${relatorio.title}`);
    doc.text(`Descrição: ${relatorio.description}`);
    doc.text(`Data de criação: ${new Date(relatorio.createdAt).toLocaleDateString()}`);
    doc.text(`ID do Caso: ${relatorio.caseId}`);
    doc.text(`Nº do Relatório: ${relatorio._id}`, { align: 'left' });

    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'relatorios',
          public_id: `relatorio-${relatorio._id}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
    });

    return uploadResult.secure_url;
  }

  async gerarLaudoPDF(laudo: any): Promise<string> {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.fontSize(20).text('Laudo Técnico', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Título: ${laudo.title}`);
    doc.text(`Descrição: ${laudo.description}`);
    doc.text(`ID da Evidência: ${laudo.evidenciaId}`);
    doc.text(`Assinado: ${laudo.assinado ? 'Sim' : 'Não'}`);

    if (laudo.dataAssinatura) {
      doc.text(`Data de Assinatura: ${new Date(laudo.dataAssinatura).toLocaleDateString()}`);
    }

    if (laudo.peritoAssinante?.name) {
      doc.text(`Perito Assinante: ${laudo.peritoAssinante.name}`);
    }

    doc.text(`Nº do Laudo: ${laudo._id}`, { align: 'left' });

    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'laudos',
          public_id: `laudo-${laudo._id}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
    });

    return uploadResult.secure_url;
  }
}
