import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateLaudoDTO, UpdateLaudoDTO } from 'src/laudos/laudo.dto';
import { Laudo, LaudoDocument } from 'src/laudos/laudo.schema';
import { PdfService } from './shared/pdf.service';
import { EvidenciaService } from 'src/evidencias/evidencia.service';
import { GeminiService } from 'src/gemini_laudo/gemini.service';
import { ReplicateService } from 'src/replicate/replicate.service';

@Injectable()
export class LaudoService {
  constructor(
    @InjectModel('Laudo') private readonly laudoModel: Model<LaudoDocument>,
    private readonly pdfService: PdfService,
    private readonly evidenciaService: EvidenciaService,
    private readonly geminiService: GeminiService,
    private readonly replicateService: ReplicateService,
  ) {}

  async create(CreateLaudoDTO: CreateLaudoDTO): Promise<Laudo> {
    const createdLaudo = new this.laudoModel(CreateLaudoDTO);
    await createdLaudo.save();

    const pdfUrl = await this.pdfService.gerarLaudoPDF(createdLaudo);

    createdLaudo.pdfUrl = pdfUrl;
    return createdLaudo.save();
  }

  async gerarLaudoPorEvidencia(evidenciaId: string): Promise<Laudo> {
    const evidencia = await this.evidenciaService.findOne(evidenciaId);
    if (!evidencia) {
      throw new NotFoundException('Evidência não encontrada');
    }

    let descricaoImagem = '';
    if (evidencia.imageUrl) {
      try {
        descricaoImagem = await this.replicateService.descreverImagem(
          evidencia.imageUrl,
        );
      } catch (err) {
        console.warn(
          'Falha ao gerar descrição da imagem com Replicate:',
          err.message,
        );
      }
    }

    const textoLaudo = await this.geminiService.gerarLaudo({
      title: evidencia.title ?? 'Título não informado',
      description: evidencia.description ?? 'Descrição não informada',
      tipo: evidencia.tipo ?? 'Tipo não informado',
      local: evidencia.local ?? 'Local não informado',
      dateRegister: evidencia.dateRegister.toISOString(),
      imageUrl: evidencia.imageUrl ?? '',
      descricaoImagem, // novo campo!
    });

    const laudo = new this.laudoModel({
      evidenciaId: evidencia._id,
      title: evidencia.title,
      description: evidencia.description,
      tipo: evidencia.tipo,
      local: evidencia.local,
      conteudo: textoLaudo,
      assinado: false,
    });

    await laudo.save();

    const pdfUrl = await this.pdfService.gerarLaudoPDF(laudo);
    laudo.pdfUrl = pdfUrl;

    return laudo.save();
  }

  async AssinarLaudo(id: string, peritoId: string): Promise<Laudo> {
    const laudo = await this.laudoModel.findById(id);
    if (!laudo) {
      throw new NotFoundException(`Laudo com ID ${id} não encontrado`);
    }
    if (laudo.assinado) {
      throw new Error('Este laudo já foi assinado.');
    }

    laudo.assinado = true;
    laudo.dataAssinatura = new Date();
    laudo.peritoAssinante = new Types.ObjectId(peritoId);

    await laudo.populate('peritoAssinante', 'name');

    const pdfUrl = await this.pdfService.gerarLaudoPDF(laudo);
    laudo.pdfUrl = pdfUrl;

    return laudo.save();
  }

  async findAll(): Promise<any[]> {
    return this.laudoModel
      .find()
      .populate('peritoAssinante', 'nome email')
      .populate({
        path: 'evidenciaId',
        populate: {
          path: 'caseId',
        },
      })
      .exec();
  }

  async findbyEvidencia(evidenciaId: string): Promise<any[]> {
    return this.laudoModel
      .find({ evidenciaId: evidenciaId })
      .populate('peritoAssinante', 'nome email')
      .exec();
  }

  async findbyEvidenciaId(evidenciaId: string) {
    const objectId = new Types.ObjectId(evidenciaId);
    console.log('Buscando laudo com evidenciaId ObjectId:', objectId);

    const laudo = await this.laudoModel
      .findOne({ evidenciaId: objectId }) // <== necessário usar ObjectId
      .exec();

    if (!laudo) {
      throw new NotFoundException(
        `Laudo não encontrado para evidência ${evidenciaId}`,
      );
    }

    return laudo;
  }
  async update(id: string, updateLaudoDTO: UpdateLaudoDTO): Promise<Laudo> {
    const updatedLaudo = await this.laudoModel.findByIdAndUpdate(
      id,
      updateLaudoDTO,
      { new: true },
    );
    if (!updatedLaudo) {
      throw new NotFoundException(`Laudo com ID ${id} não encontrado`);
    }

    const pdfUrl = await this.pdfService.gerarLaudoPDF(updatedLaudo);
    updatedLaudo.pdfUrl = pdfUrl;
    await updatedLaudo.save();
    return updatedLaudo;
  }

  async findOneById(id: string): Promise<Laudo | null> {
    return this.laudoModel.findById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.laudoModel.findByIdAndDelete(id);
    if (!result)
      throw new NotFoundException('Evidência não encontrada para deletar');
  }
}
