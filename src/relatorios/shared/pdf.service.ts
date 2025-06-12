import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as streamifier from 'streamifier';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Relatorio } from '../relatorio.schema';

@Injectable()
export class PdfService {
  async gerarRelatorioPDF(relatorio: Relatorio): Promise<string> {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Uint8Array[] = [];

    doc.on('data', (chunk: Uint8Array) => buffers.push(chunk));

    const addFooter = () => {
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc
          .fontSize(9)
          .fillColor('gray')
          .text(`Página ${i + 1} de ${range.count}`, 50, doc.page.height - 50, {
            align: 'center',
          });
      }
    };

    // Cabeçalho institucional
    doc
      .image('src/assets/logo.png', 50, 40, { width: 70 }) // Opcional
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Instituto de Perícia Técnica e Criminalística', 130, 50, {
        align: 'center',
      })
      .moveDown(2);

    // Informações do relatório
    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Número do Relatório: ${relatorio._id}`, { continued: true })
      .text(`   |   Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`)
      .moveDown(1.5);

    // Título do documento
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Relatório Técnico Pericial Completo', {
        align: 'center',
        underline: true,
      })
      .moveDown(2);

    // Conteúdo técnico gerado por LLM
    doc
      .fontSize(12)
      .font('Helvetica')
      .text(relatorio.conteudo || 'Sem conteúdo disponível', {
        align: 'justify',
      })
      .moveDown(2);

    // Assinatura do perito (caso assinado)
    if (
      relatorio.assinado &&
      relatorio.peritoAssinante &&
      relatorio.dataAssinatura
    ) {
      const nomePerito =
        typeof relatorio.peritoAssinante === 'object' &&
        'name' in relatorio.peritoAssinante
          ? relatorio.peritoAssinante.name
          : 'Perito Desconhecido';

      doc
        .moveDown(4)
        .font('Helvetica')
        .fontSize(12)
        .text(nomePerito as string, { align: 'center' })
        .text('____________________________________', { align: 'center' })
        .text(
          `Assinado em: ${new Date(relatorio.dataAssinatura).toLocaleDateString('pt-BR')}`,
          { align: 'center' },
        );
    }

    doc.end();
    doc.on('end', () => addFooter());

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
            folder: 'relatorios',
            public_id: `relatorio-${relatorio._id}`,
            format: 'pdf',
          },
          (err, result) => {
            if (err) return reject(new Error(`erro no upload: ${err.message}`));
            resolve(result as UploadApiResponse);
          },
        );
        const readStream = streamifier.createReadStream(buffer);
        readStream.pipe(stream);
      },
    );

    return uploadResult.secure_url;
  }
}
