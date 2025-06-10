import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as streamifier from 'streamifier';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Laudo } from '../laudo.schema';

@Injectable()
export class PdfService {
  async gerarLaudoPDF(laudo: Laudo): Promise<string> {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Uint8Array[] = [];

    // Captura do buffer
    doc.on('data', (chunk: Uint8Array) => buffers.push(chunk));

    // Rodapé com numeração de páginas
    const addFooter = () => {
      const range = doc.bufferedPageRange(); // { start: 0, count: 1 }
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(9)
          .fillColor('gray')
          .text(`Página ${i + 1} de ${range.count}`, 50, doc.page.height - 50, {
            align: 'center',
          });
      }
    };

    // Cabeçalho institucional
    doc
      .image('src/assets/logo.png', 50, 40, { width: 70 }) // Se houver logotipo, opcional
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Instituto de Perícia Técnica e Criminalística', 130, 50, {
        align: 'center',
      })
      .moveDown(2);

    // Informações do laudo
    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Número do Laudo: ${laudo.id}`, { continued: true })
      .text(`   |   Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`)
      .moveDown(1.5);

    // Título do documento
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Laudo Técnico Pericial', { align: 'center', underline: true })
      .moveDown(2);

    // Título da evidência (se separado)
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Título da Evidência:')
      .moveDown(0.3)
      .font('Helvetica')
      .text(laudo.title)
      .moveDown();

    // Conteúdo gerado (laudo técnico real)
    doc
      .fontSize(12)
      .font('Helvetica')
      .text(laudo.conteudo || 'Sem conteúdo disponível', {
        align: 'justify',
      })
      .moveDown(2);

    // Assinatura (se disponível)
    if (laudo.assinado && laudo.peritoAssinante && laudo.dataAssinatura) {
      const nomePerito =
        typeof laudo.peritoAssinante === 'object' &&
        'name' in laudo.peritoAssinante
          ? laudo.peritoAssinante.name
          : 'Perito Desconhecido';

      doc
        .moveDown(4)
        .font('Helvetica')
        .fontSize(12)
        .text(nomePerito as string, { align: 'center' })
        .text('____________________________________', { align: 'center' })
        .text(
          `Assinado em: ${new Date(laudo.dataAssinatura).toLocaleDateString(
            'pt-BR',
          )}`,
          { align: 'center' },
        );
    }

    doc.end();

    // Adiciona rodapé ao finalizar
    doc.on('end', () => addFooter());

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err: Error) =>
        reject(new Error(`Erro ao gerar PDF: ${err.message}`)),
      );
    });

    // Upload no Cloudinary
    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: 'laudos',
            public_id: `laudo-${laudo.id}`,
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
