import { CreateOdontogramaDTO } from './odontograma.dto';
import { Odontograma, OdontogramaDocument } from './odontograma.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class OdontogramaService {
  constructor(
    @InjectModel('Odontograma')
    private readonly odontogramaModel: Model<OdontogramaDocument>,
  ) {}

  async create(
    createOdontogramaDTO: CreateOdontogramaDTO,
  ): Promise<Odontograma> {
    const createOdontograma = new this.odontogramaModel(createOdontogramaDTO);
    await createOdontograma.save();
    return createOdontograma;
  }

  async findAll(): Promise<Odontograma[]> {
    return this.odontogramaModel.find().populate({
      path: 'vitimaId',
    });
  }

  async findOneById(id: string): Promise<Odontograma | null> {
    return this.odontogramaModel.findById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.odontogramaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Dente com ID ${id} não encontrado`);
    }
  }
}
