import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CaseDocument } from 'src/cases/case.schema'; // Certifique-se de importar o modelo Caso
import { Laudo, LaudoDocument } from 'src/laudos/laudo.schema';
import { Evidencia, EvidenciaDocument } from 'src/evidencias/evidencias.schema';

interface CasosPorMes {
  _id: number; // Mês
  pendentes: number;
  concluidos: number;
}

interface CasosPorTipo {
  _id: string; // Tipo
  total: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Case') private readonly caseModel: Model<CaseDocument>, // Alterado para usar Caso.name
    @InjectModel(Evidencia.name)
    private readonly evidenciaModel: Model<EvidenciaDocument>, // Alterado para 'Evidencia'
    @InjectModel(Laudo.name) private readonly laudoModel: Model<LaudoDocument>, // Alterado para 'Laudo'
  ) {}

  async getDashboardResumo() {
    const totalCasos = await this.caseModel.countDocuments();
    const totalEvidencias = await this.evidenciaModel.countDocuments();
    const totalLaudos = await this.laudoModel.countDocuments();

    const casosPendentes = await this.caseModel.countDocuments({
      status: 'PENDENTE',
    });
    const casosConcluidos = await this.caseModel.countDocuments({
      status: 'CONCLUIDO',
    });

    const evidenciasSemLaudo = await this.evidenciaModel.countDocuments({
      laudo: { $exists: false },
    });

    const percentualEvidenciasComLaudo =
      totalEvidencias > 0
        ? ((totalEvidencias - evidenciasSemLaudo) / totalEvidencias) * 100
        : 0;

    // AGREGGAÇÃO POR MÊS
    const casosPorMes: CasosPorMes[] = await this.caseModel.aggregate([
      {
        $group: {
          _id: { $month: '$dataAbertura' }, // Modificado para usar dataAbertura
          pendentes: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDENTE'] }, 1, 0] },
          },
          concluidos: {
            $sum: { $cond: [{ $eq: ['$status', 'CONCLUIDO'] }, 1, 0] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // AGREGGAÇÃO POR TIPO
    const casosPorTipo: CasosPorTipo[] = await this.caseModel.aggregate([
      {
        $group: {
          _id: '$tipo',
          total: { $sum: 1 },
        },
      },
    ]);

    return {
      totalCasos,
      totalEvidencias,
      totalLaudos,
      casosPendentes,
      casosConcluidos,
      evidenciasSemLaudo,
      percentualEvidenciasComLaudo,
      casosPorMes: casosPorMes.map((caso) => ({
        mes: this.getNomeMes(caso._id), // Certificando-se de chamar a função corretamente
        pendentes: caso.pendentes,
        concluidos: caso.concluidos,
      })),
      casosPorTipo: casosPorTipo.map((caso) => ({
        tipo: caso._id || 'Sem Tipo',
        quantidade: caso.total,
      })),
    };
  }

  private getNomeMes(numeroMes: number): string {
    const meses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return meses[numeroMes - 1] || '';
  }
}
