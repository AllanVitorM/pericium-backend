import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Caso, CaseDocument } from 'src/cases/case.schema';
import { CreateCaseDTO, UpdateCaseDTO } from 'src/cases/case.dto';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class CaseService {
  constructor(@InjectModel('Case') private caseModel: Model<CaseDocument>) {}

  async create(createCaseDTO: CreateCaseDTO): Promise<Caso> {
    const newCase = new this.caseModel(createCaseDTO);
    return newCase.save();
  }

  async findAll(): Promise<Caso[]> {
    return this.caseModel.find().exec();
  }

  async findById(id: string): Promise<Caso | null> {
    return this.caseModel.findById(id).exec();
  }

  async findOne(titulo: string): Promise<Caso | null> {
    return this.caseModel.findOne({ titulo }).exec();
  }

  async findOneDataAbertura(start: Date, end: Date): Promise<Caso | null> {
    return await this.caseModel
      .findOne({ dataAbertura: { $gte: start, $lte: end } })
      .exec();
  }

  async update(id: string, data: Partial<UpdateCaseDTO>) {
    return this.caseModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async updateByDataFechamento(
    id: string,
    dataFechamento: Date,
  ): Promise<Caso> {
    const caso = await this.caseModel.findOne({ _id: id });

    if (!caso) {
      throw new NotFoundException(`Caso com título '${id}' não encontrado`);
    }
    if (caso.dataFechamento) {
      throw new BadRequestException('Este caso já está fechado.');
    }

    caso.dataFechamento = dataFechamento;
    caso.status = Status.CONCLUIDO;

    return caso.save();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.caseModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
