import { CreateVitimaDTO, UpdateVitimaDTO } from './vitima.dto';
import { Vitima, VitimaDocument } from './vitima.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class VitimaService {
  constructor(
    @InjectModel('Vitima') private readonly vitimaModel: Model<VitimaDocument>,
  ) {}

  async create(createVitimaDTO: CreateVitimaDTO): Promise<Vitima> {
    const createVitima = new this.vitimaModel(createVitimaDTO);
    await createVitima.save();
    return createVitima;
  }

  async findAll(): Promise<Vitima[]> {
    return this.vitimaModel.find().populate('caseId').exec();
  }

  async findOneById(id: string): Promise<Vitima | null> {
    const vitima = await this.vitimaModel.findById(id).populate('caseId').exec();
    if (!vitima) throw new NotFoundException('Vítima não encontrada!');
    return vitima;
  }

  async findByCaseId(caseId: string): Promise<Vitima[]> {
    return this.vitimaModel.find({ caseId }).populate('caseId').exec();
  }

  async updateVitima(id: string, dto: UpdateVitimaDTO): Promise<Vitima> {
    const update = await this.vitimaModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!update)
      throw new NotFoundException('Vítima não encontrada para atualização!');
    return update;
  }

  async remove(id: string): Promise<void> {
    const result = await this.vitimaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Vítima com ID ${id} não encontrada`);
    }
  }
}
