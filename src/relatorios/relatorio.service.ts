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
import { CaseService } from 'src/cases/case.service';
import { EvidenciaDocument } from 'src/evidencias/evidencias.schema';
import { LaudoDocument } from 'src/laudos/laudo.schema';
import { VitimaDocument } from 'src/vitima/vitima.schema';
import { OdontogramaDocument } from 'src/odontograma/odontograma.schema';
import { GeminiService } from 'src/gemini_laudo/gemini.service';
import { DadosRelatorioCompleto } from 'src/types/relatorio.types';
@Injectable()
export class RelatorioService {
  constructor(
    @InjectModel('Relatorio')
    private readonly relatorioModel: Model<RelatorioDocument>,
    private readonly pdfService: PdfService,
    @InjectModel('Case')
    private readonly casoModel: Model<CaseDocument>,
    private readonly casoService: CaseService,
    @InjectModel('Evidencia')
    private readonly evidenciaModel: Model<EvidenciaDocument>,
    @InjectModel('Laudo')
    private readonly laudoModel: Model<LaudoDocument>,
    @InjectModel('Vitima')
    private readonly vitimaModel: Model<VitimaDocument>,
    @InjectModel('Odontograma')
    private readonly odontogramaModel: Model<OdontogramaDocument>,

    private readonly geminiService: GeminiService,
  ) {}

  async create(CreateRelatorioDTO: CreateRelatorioDTO): Promise<Relatorio> {
    const createdRelatorio = new this.relatorioModel({
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

  async gerarRelatorioCompleto(
    caseId: string,
    userId: string,
  ): Promise<Relatorio> {
    const caso = await this.casoService.findById(caseId);
    if (!caso) {
      throw new NotFoundException('Caso não encontrado');
    }

    const evidencias = await this.evidenciaModel.find({ caseId }).lean();
    const evidenciasComLaudos = await Promise.all(
      evidencias.map(async (evidencia) => {
        const laudos = await this.laudoModel
          .find({ evidenciaId: evidencia._id })
          .lean();
        return { ...evidencia, laudos };
      }),
    );

    const vitimas = await this.vitimaModel.find({ caseId }).lean();

    const vitimasComOdontogramas = await Promise.all(
      vitimas.map(async (vitima) => {
        const odontogramas = await this.odontogramaModel
          .find({ vitimaId: vitima._id })
          .lean();
        return { ...vitima, odontogramas };
      }),
    );

    const dadosRelatorio: DadosRelatorioCompleto = {
      caso: {
        titulo: caso.titulo,
        descricao: caso.descricao,
        status: caso.status,
        dataAbertura: caso.dataAbertura.toISOString(),
      },
      evidencias: evidenciasComLaudos.map((e) => ({
        title: e.title ?? '',
        description: e.description ?? '',
        tipo: e.tipo ?? '',
        local: e.local ?? '',
        dateRegister:
          e.dateRegister instanceof Date ? e.dateRegister.toISOString() : '',
        laudos: e.laudos.map((l) => ({
          title: l.title ?? '',
          conteudo: l.conteudo ?? '',
        })),
      })),
      vitimas: vitimasComOdontogramas.map((v) => ({
        nome: v.nome ?? '',
        genero: v.genero ?? '',
        documento: v.documento ? String(v.documento) : '',
        endereco: v.endereco ?? '',
        etnia: v.etnia ? String(v.etnia) : '',
        odontogramas: v.odontogramas.map((o) => ({
          dentes: o.dentes ?? '',
          tipodente: o.tipodente ?? '',
          observacoes: o.observacoes ?? '',
        })),
      })),
    };

    const textoRelatorio =
      await this.geminiService.gerarRelatorioCompleto(dadosRelatorio);

    const relatorio = new this.relatorioModel({
      title: `Relatório do Caso: ${caso.titulo}`,
      caseId: caso,
      conteudo: textoRelatorio,
      assinado: true,
      dataAssinatura: new Date().toISOString(),
      peritoAssinante: userId,
    });

    await relatorio.save();

    const pdfUrl = await this.pdfService.gerarRelatorioPDF(relatorio);
    relatorio.pdfUrl = pdfUrl;

    return relatorio.save(); // Retorna o objeto Relatorio com PDF incluso
  }
  async findAll(): Promise<any[]> {
    return this.relatorioModel
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
    return this.relatorioModel
      .find({ caseId: caseId })
      .populate('peritoAssinante', 'nome email')
      .exec();
  }

  async update(
    id: string,
    updateRelatorioDTO: UpdateRelatorioDTO,
  ): Promise<Relatorio> {
    const updatedRelatorio = await this.relatorioModel.findByIdAndUpdate(
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
    return this.relatorioModel.findById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.relatorioModel.findByIdAndDelete(id);
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
