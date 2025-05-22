import { CreateVitimaDTO } from './vitima.dto';
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
    return this.vitimaModel.find();
  }
  async findOneById(id: string): Promise<Vitima | null> {
    return this.vitimaModel.findById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.vitimaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Vitima com ID ${id} não encontrada`);
    }
  }
}
