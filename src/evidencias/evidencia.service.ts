import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evidencia } from 'src/evidencias/evidencias.schema';
import {
  CreateEvidenciaDTO,
  updateEvidenciaDTO,
} from 'src/evidencias/evidencia.dto';
import { CaseService } from '../cases/case.service';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  v2 as CloudinaryType,
} from 'cloudinary';

@Injectable()
export class EvidenciaService {
  constructor(
    @InjectModel(Evidencia.name)
    private readonly evidenciaModel: Model<Evidencia>,
    private readonly caseService: CaseService,
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof CloudinaryType,
  ) {}

  async createEvidencia(
    dto: CreateEvidenciaDTO,
    file: Express.Multer.File,
  ): Promise<Evidencia> {
    const caseExists = await this.caseService.findById(dto.caseId);
    if (!caseExists) {
      throw new NotFoundException('O caso informado não existe.');
    }

    let imageUrl: string | null = null;

    if (file) {
      // Transforma upload_stream em Promise<string>
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

    const created = new this.evidenciaModel({
      ...dto,
      imageUrl, // Aqui agora é uma string ou null
    });

    return created.save();
  }

  async findAll(): Promise<Evidencia[]> {
    return this.evidenciaModel.find().populate('caseId').exec();
  }

  async findOne(id: string): Promise<Evidencia> {
    const evidencia = await this.evidenciaModel
      .findById(id)
      .populate('caseId')
      .exec();
    if (!evidencia) throw new NotFoundException('Evidencia não encontrada.');
    return evidencia;
  }

  async updateEvidencia(
    id: string,
    dto: updateEvidenciaDTO,
  ): Promise<Evidencia> {
    const updated = await this.evidenciaModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated)
      throw new NotFoundException('Evidência não encontrada para atualizar');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.evidenciaModel.findByIdAndDelete(id);
    if (!result)
      throw new NotFoundException('Evidência não encontrada para deletar');
  }
}
