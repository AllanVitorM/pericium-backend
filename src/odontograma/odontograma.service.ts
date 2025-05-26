import { CreateOdontogramaDTO, UpdateOdontogramaDTO } from './odontograma.dto';
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

  async findOne(id: string): Promise<Odontograma> {
    const odonto = await this.odontogramaModel
      .findById(id)
      .populate('vitimaId')
      .exec();
    if (!odonto) throw new NotFoundException('Odontograma não encontrado.');
    return odonto;
  }

  async findByVitimaId(vitimaId: string): Promise<Odontograma[]> {
    return this.odontogramaModel.find({ vitimaId }).populate('vitimaId').exec();
  }

  async updateOdontograma(
    id: string,
    dto: UpdateOdontogramaDTO,
  ): Promise<Odontograma> {
    const update = await this.odontogramaModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!update)
      throw new NotFoundException(
        'Odontograma não encontrado para atualização.',
      );
    return update;
  }

  async remove(id: string): Promise<void> {
    const result = await this.odontogramaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Dente com ID ${id} não encontrado`);
    }
  }
}
