import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateLaudoDTO } from "src/DTO/laudo.dto";

@Injectable()
export class LaudoService {
    constructor(
        @InjectModel('Laudo') private readonly laudoModel: Model<any>,
) {}

    async create(CreateLaudoDTO: CreateLaudoDTO): Promise<any> {
      const novoLaudo = new this.laudoModel(CreateLaudoDTO);
      return novoLaudo.save();
    }

    async findAll(): Promise<any[]> {
        return this.laudoModel
        .find()
        .populate('peritorespomsavel', 'nome email')
        .populate('evidencia')
        .exec();
    }

    async findbyEvidencia(evidenciaId: string): Promise<any[]> {
        return this.laudoModel
        .find({evidencia: evidenciaId})
        .populate('peritoresponsavel', 'nome email')
        .exec();
    }



    }
