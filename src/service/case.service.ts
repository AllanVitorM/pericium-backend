import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Case, CaseDocument } from 'src/schemas/case.schema';
import { CreateCaseDTO, UpdateCaseDTO } from 'src/DTO/case.dto';

@Injectable()
export class CaseService {
  constructor(
    @InjectModel('Case') private caseModel: Model<CaseDocument>,
  ) {}

  async create(createCaseDTO: CreateCaseDTO): Promise<Case> {
    const newCase = new this.caseModel(createCaseDTO);
    return newCase.save();
  }

  async findAll(): Promise<Case[]> {
    return this.caseModel.find().exec();
  }

  async findOne(titulo: string): Promise<Case | null> {
    return this.caseModel.findOne({ titulo }).exec();
  }

  async findOneDescricao(descricao: string): Promise<Case | null> {
    return this.caseModel.findOne({ descricao }).exec();
  }

  async update(
    titulo: string,
    updateCaseDTO: UpdateCaseDTO,
  ): Promise<Case | null> {
    const existingCase = await this.caseModel.findOne({ titulo });
    if (!existingCase) return null;

    return this.caseModel
      .findOneAndUpdate({ titulo }, updateCaseDTO, { new: true })
      .exec();
  }
  
  async updateByDescricao(
    descricao: string,
    updateCaseDTO: UpdateCaseDTO,
  ): Promise<Case | null> {
    const existingCase = await this.caseModel.findOne({ descricao }).exec();
  
    if (!existingCase) {
      return null; 
    }
  
    return this.caseModel
      .findOneAndUpdate({ descricao }, updateCaseDTO, { new: true })
      .exec();
  }
  

  async remove(titulo: string): Promise<boolean> {
    const result = await this.caseModel.deleteOne({ titulo }).exec();
    return result.deletedCount > 0;
  }

  async removeByDescriçao(descricao: string): Promise<boolean> {
    const result = await this.caseModel.deleteOne({ descricao }).exec();
    return result.deletedCount > 0;
  }
}
