import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateRelatorioDTO,
  UpdateRelatorioDTO,
} from 'src/relatorios/relatorio.dto';
import { Relatorio, RelatorioDocument } from 'src/relatorios/relatorio.schema';
import { PdfService } from './shared/pdf.service';
import { CaseDocument } from 'src/cases/case.schema';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class RelatorioService {
  constructor(
    @InjectModel('Relatorio')
    private readonly RelatorioModel: Model<RelatorioDocument>,
    private readonly pdfService: PdfService,
    @InjectModel('Case')
    private readonly casoModel: Model<CaseDocument>,
  ) {}

  async create(CreateRelatorioDTO: CreateRelatorioDTO): Promise<Relatorio> {
    const createdRelatorio = new this.RelatorioModel({
      ...CreateRelatorioDTO,
      assinado: true,
      dataAssinatura: new Date(),
      peritoAssinante: new Types.ObjectId(CreateRelatorioDTO.userId),
    });

    await createdRelatorio.save();

    const pdfUrl = await this.pdfService.gerarRelatorioPDF(createdRelatorio);
    createdRelatorio.pdfUrl = pdfUrl;
    await createdRelatorio.save();

    if (CreateRelatorioDTO.caseId) {
      await this.fecharCaso(CreateRelatorioDTO.caseId);
    }

    return createdRelatorio;
  }

  async findAll(): Promise<any[]> {
    return this.RelatorioModel.find()
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
    return this.RelatorioModel.find({ caseId: caseId })
      .populate('peritoAssinante', 'nome email')
      .exec();
  }

  async update(
    id: string,
    updateRelatorioDTO: UpdateRelatorioDTO,
  ): Promise<Relatorio> {
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

  async remove(id: string): Promise<void> {
    const result = await this.RelatorioModel.findByIdAndDelete(id);
    if (!result)
      throw new NotFoundException('Relatorio não encontrado para deletar');
  }

  async fecharCaso(caseId: string) {
    const caso = await this.casoModel.findById(caseId);
    if (!caso) {
      throw new NotFoundException(`Caso não encontrado ${caseId}`);
    }
    caso.status = Status.CONCLUIDO;
    await caso.save();
  }
}
