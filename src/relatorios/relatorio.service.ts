import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRelatorioDTO, UpdateRelatorioDTO } from 'src/relatorios/relatorio.dto';
import { Relatorio, RelatorioDocument } from 'src/relatorios/relatorio.schema';
import { PdfService } from './shared/pdf.service';

@Injectable()
export class RelatorioService {
  constructor(
    @InjectModel('Relatorio') private readonly RelatorioModel: Model<RelatorioDocument>,
    private readonly pdfService: PdfService,
  ) {}

  async create(CreateRelatorioDTO: CreateRelatorioDTO): Promise<Relatorio> {
    const createdRelatorio = new this.RelatorioModel(CreateRelatorioDTO);
    await createdRelatorio.save();

    const pdfUrl = await this.pdfService.gerarRelatorioPDF(createdRelatorio);

    createdRelatorio.pdfUrl = pdfUrl;
    return createdRelatorio.save();
  }

  async AssinarRelatorio(id: string, peritoId: string): Promise<Relatorio> {
    const Relatorio = await this.RelatorioModel.findById(id);
    if (!Relatorio) {
      throw new NotFoundException(`Relatório com ID ${id} não encontrado`);
    }
    if (Relatorio.assinado) {
      throw new Error('Este relatório já foi assinado.');
    }

    Relatorio.assinado = true;
    Relatorio.dataAssinatura = new Date();
    Relatorio.peritoAssinante = new Types.ObjectId(peritoId);

    await Relatorio.populate('peritoAssinante', 'name');

    const pdfUrl = await this.pdfService.gerarRelatorioPDF(Relatorio);
    Relatorio.pdfUrl = pdfUrl;

    return Relatorio.save();
  }

  async findAll(): Promise<any[]> {
    return this.RelatorioModel
      .find()
      .populate('peritoAssinante', 'nome email')
      .populate({
        path: 'caseId',
        populate: {
          path: 'caseId',
        },
      })
      .exec();
  }

  async findbyCase(caseId: string): Promise<any[]> {
    return this.RelatorioModel
      .find({ caseId: caseId })
      .populate('peritoAssinante', 'nome email')
      .exec();
  }

  async update(id: string, updateRelatorioDTO: UpdateRelatorioDTO): Promise<Relatorio> {
    const updatedRelatorio = await this.RelatorioModel.findByIdAndUpdate(
      id,
      updateRelatorioDTO,
      { new: true },
    );
    if (!updatedRelatorio) {
      throw new NotFoundException(`Relatório com ID ${id} não encontrado`);
    }

    const pdfUrl = await this.pdfService.gerarRelatorioPDF(updatedRelatorio);
    updatedRelatorio.pdfUrl = pdfUrl;
    await updatedRelatorio.save();
    return updatedRelatorio;
  }

  async findOneById(id: string): Promise<Relatorio | null> {
    return this.RelatorioModel.findById(id);
  }
}
