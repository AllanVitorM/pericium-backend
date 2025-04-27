import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Case') private readonly caseModel: Model<any>,
  ) {}

  async getDashboardResumo() {
    console.log('======== DashboardService ========');

    const [porStatus, porTipo, totalEvidencias] = await Promise.all([
      this.caseModel.aggregate([
        {
          $group: {
            _id: '$status',
            total: { $sum: 1 },
          },
        },
        {
          $project: {
            status: '$_id',
            total: 1,
            _id: 0,
          },
        },
      ]),
      this.caseModel.aggregate([
        {
          $group: {
            _id: '$tipo',
            total: { $sum: 1 },
          },
        },
        {
          $project: {
            tipo: '$_id',
            total: 1,
            _id: 0,
          },
        },
      ]),
      this.caseModel.aggregate([
        { $unwind: '$evidencias' },
        { $count: 'total' },
      ]),
    ]);

    console.log('Por Status:', porStatus);
    console.log('Por Tipo:', porTipo);
    console.log('Total de Evidências:', totalEvidencias[0]?.total || 0);
    console.log('===================================');

    return { 
      porStatus, 
      porTipo,
      totalEvidencias: totalEvidencias[0]?.total || 0,
    };
  }
}
