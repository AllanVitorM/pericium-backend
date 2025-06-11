import { CreateOdontogramaDTO, UpdateOdontogramaDTO } from './odontograma.dto';
import { Odontograma, OdontogramaDocument } from './odontograma.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  v2 as CloudinaryType,
} from 'cloudinary';

@Injectable()
export class OdontogramaService {
  constructor(
    @InjectModel('Odontograma')
    private readonly odontogramaModel: Model<OdontogramaDocument>,
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof CloudinaryType,
  ) {}

  async create(
    createOdontogramaDTO: CreateOdontogramaDTO,
    file?: Express.Multer.File,
  ): Promise<Odontograma> {
    let imageUrl: string | null = null;

    if (file) {
      imageUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          { folder: 'evidencias', resource_type: 'auto', type: 'upload' },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (error) {
              console.error('Erro ao subir imagem:', error);
              return reject(new Error('Falha ao subir imagem no Cloudinary'));
            }
            if (!result?.secure_url) {
              return reject(new Error('Falha ao obter URL da imagem'));
            }
            resolve(result.secure_url);
          },
        );
        uploadStream.end(file.buffer);
      });
    }

    const createOdontograma = new this.odontogramaModel({
      ...createOdontogramaDTO,
      imageUrl,
    });

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
