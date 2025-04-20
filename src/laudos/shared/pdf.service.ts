import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as streamifier from 'streamifier';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Laudo } from '../laudo.schema';

@Injectable()
export class PdfService {
  async gerarLaudoPDF(laudo: Laudo): Promise<string> {
    const doc = new PDFDocument();
    const buffers: Uint8Array[] = [];

    doc.on('data', (chunk: Uint8Array) => buffers.push(chunk));

    // Título
    doc
      .font('Times-Bold')
      .fontSize(22)
      .text('LAUDO PERICIAL TÉCNICO', { align: 'center' })
      .moveDown(2);

    // Cabeçalho
    doc
      .fontSize(12)
      .font('Times-Roman')
      .text(`Nº do Laudo: ${laudo._id}`, { align: 'left' })
      .text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`)
      .moveDown();

    // Seção: Título
    doc
      .font('Times-Bold')
      .fontSize(14)
      .text('Título:', { underline: true })
      .moveDown(0.2)
      .font('Times-Roman')
      .fontSize(12)
      .text(laudo.title)
      .moveDown();

    // Seção: Descrição
    doc
      .font('Times-Bold')
      .fontSize(14)
      .text('Descrição:', { underline: true })
      .moveDown(0.2)
      .font('Times-Roman')
      .fontSize(12)
      .text(laudo.description || 'Sem descrição disponível')
      .moveDown(2);

    // Assinatura
    if (laudo.assinado && laudo.peritoAssinante && laudo.dataAssinatura) {
      const nomePerito =
        typeof laudo.peritoAssinante === 'object' &&
        'name' in laudo.peritoAssinante
          ? laudo.peritoAssinante.name
          : 'Perito Desconhecido';

      doc
        .font('Times-Roman')
        .fontSize(12)
        .text(`${nomePerito}`, { align: 'center' })
        .text('____________________________________', { align: 'center' })
        .text(
          `Assinado em: ${new Date(laudo.dataAssinatura).toLocaleDateString('pt-BR')}`,
          {
            align: 'center',
          },
        );
    }

    doc.end();

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err: Error) =>
        reject(new Error(`Erro ao gerar PDF: ${err.message}`)),
      );
    });

    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: 'laudos',
            public_id: `laudo-${laudo._id}`,
            format: 'pdf',
          },
          (err, result) => {
            if (err) return reject(new Error(`erro no upload: ${err.message}`));
            resolve(result as UploadApiResponse);
          },
        );
        const readSteam = streamifier.createReadStream(buffer);
        readSteam.pipe(stream);
      },
    );
    return uploadResult.secure_url;
  }
}
