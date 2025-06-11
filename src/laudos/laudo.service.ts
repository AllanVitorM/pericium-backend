import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Laudo, LaudoDocument } from './laudo.schema';
import { CreateLaudoDTO, UpdateLaudoDTO } from './laudo.dto';
import { PdfService } from 'src/laudos/shared/pdf.service';

@Injectable()
export class LaudoService {
  constructor(
    @InjectModel(Laudo.name) private laudoModel: Model<LaudoDocument>,
    private readonly pdfService: PdfService,
  ) {}

  async create(dto: CreateLaudoDTO): Promise<Laudo> {
    const exists = await this.laudoModel.findOne({ evidenciaId: dto.evidenciaId });
    if (exists) throw new ConflictException('Já existe um laudo para esta evidência.');

    const laudo = new this.laudoModel({
      ...dto,
      assinado: true,
      dataAssinatura: new Date(),
      peritoAssinante: new Types.ObjectId(dto.userId),
    });
    await laudo.save();

    const pdfUrl = await this.pdfService.gerarLaudoPDF(laudo);
    laudo.pdfUrl = pdfUrl;
    return laudo.save();
  }

  async findByEvidencia(evidenciaId: string): Promise<Laudo> {
    const laudo = await this.laudoModel
      .findOne({ evidenciaId })
      .populate('peritoAssinante', 'name email');
    if (!laudo) throw new NotFoundException('Laudo não encontrado para essa evidência.');
    return laudo;
  }

  async findAll(): Promise<Laudo[]> {
    return this.laudoModel.find().populate('peritoAssinante', 'name email').exec();
  }

  async update(id: string, dto: UpdateLaudoDTO): Promise<Laudo> {
    const laudo = await this.laudoModel.findByIdAndUpdate(id, dto, { new: true });
    if (!laudo) throw new NotFoundException('Laudo não encontrado.');
    const pdfUrl = await this.pdfService.gerarLaudoPDF(laudo);
    laudo.pdfUrl = pdfUrl;
    return laudo.save();
  }

  async sign(id: string, peritoId: string): Promise<Laudo> {
    const laudo = await this.laudoModel.findById(id);
    if (!laudo) throw new NotFoundException('Laudo não encontrado.');
    if (laudo.assinado) throw new ConflictException('Laudo já foi assinado.');

    laudo.assinado = true;
    laudo.dataAssinatura = new Date();
    laudo.peritoAssinante = new Types.ObjectId(peritoId);
    const pdfUrl = await this.pdfService.gerarLaudoPDF(laudo);
    laudo.pdfUrl = pdfUrl;
    return laudo.save();
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.laudoModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Laudo não encontrado para deletar.');
  }
}
