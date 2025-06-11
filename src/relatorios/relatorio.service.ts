import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Relatorio,
  RelatorioDocument,
} from './relatorio.schema';
import {
  CreateRelatorioDTO,
  UpdateRelatorioDTO,
} from './relatorio.dto';
import { PdfService } from './shared/pdf.service';

@Injectable()
export class RelatorioService {
  constructor(
    @InjectModel(Relatorio.name)
    private relatorioModel: Model<RelatorioDocument>,
    private readonly pdfService: PdfService,
  ) {}

  async create(dto: CreateRelatorioDTO, caseId: string): Promise<Relatorio> {
    if (!Types.ObjectId.isValid(caseId)) {
      throw new NotFoundException('ID do caso inválido.');
    }

    const exists = await this.relatorioModel.findOne({ caseId });
    if (exists) {
      throw new ConflictException('Já existe um relatório para este caso.');
    }

    const rel = new this.relatorioModel({
      title: dto.title,
      description: dto.description,
      caseId: new Types.ObjectId(caseId),
      peritoAssinante: new Types.ObjectId(dto.userId),
    });

    await rel.save();

    const pdfUrl = await this.pdfService.gerarRelatorioPDF(rel);
    rel.pdfUrl = pdfUrl;
    return rel.save();
  }

  async findByCaso(caseId: string): Promise<Relatorio> {
    const rel = await this.relatorioModel
      .findOne({ caseId })
      .populate('caseId')
      .populate('peritoAssinante');

    if (!rel) {
      throw new NotFoundException('Relatório não encontrado para este caso.');
    }

    return rel;
  }

  async update(id: string, dto: UpdateRelatorioDTO): Promise<Relatorio> {
    const rel = await this.relatorioModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!rel) {
      throw new NotFoundException('Relatório não encontrado.');
    }

    const pdfUrl = await this.pdfService.gerarRelatorioPDF(rel);
    rel.pdfUrl = pdfUrl;
    return rel.save();
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.relatorioModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Relatório não encontrado para deletar.');
    }
  }
}
