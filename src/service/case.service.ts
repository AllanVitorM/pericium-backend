import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Caso, CaseDocument } from 'src/schemas/case.schema';
import { CreateCaseDTO, UpdateCaseDTO } from 'src/DTO/case.dto';

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

  async update(
    titulo: string,
    updateCaseDTO: UpdateCaseDTO,
  ): Promise<Caso | null> {
    const existingCase = await this.caseModel.findOne({ titulo });
    if (!existingCase) return null;

    return this.caseModel
      .findOneAndUpdate({ titulo }, updateCaseDTO, { new: true })
      .exec();
  }

  async updateByDescricao(
    descricao: string,
    updateCaseDTO: UpdateCaseDTO,
  ): Promise<Caso | null> {
    const existingCase = await this.caseModel.findOne({ descricao }).exec();

    if (!existingCase) {
      return null;
    }

    return this.caseModel
      .findOneAndUpdate({ descricao }, updateCaseDTO, { new: true })
      .exec();
  }
  async updateByDataFechamento(
    titulo: string,
    dataFechamento: Date,
  ): Promise<Caso> {
    const caso = await this.caseModel.findOne({ titulo });

    if (!caso) {
      throw new NotFoundException(`Caso com título '${titulo} não encontrado`);
    }
    if (caso.dataFechamento) {
      throw new BadRequestException('Este caso já está fechado.');
    }

    caso.dataFechamento = dataFechamento;
    caso.status = 'ENCERRADO';

    return caso.save();
  }

  async remove(titulo: string): Promise<boolean> {
    const result = await this.caseModel.deleteOne({ titulo }).exec();
    return result.deletedCount > 0;
  }

  async removeByDescricao(descricao: string): Promise<boolean> {
    const result = await this.caseModel.deleteOne({ descricao }).exec();
    return result.deletedCount > 0;
  }
}
