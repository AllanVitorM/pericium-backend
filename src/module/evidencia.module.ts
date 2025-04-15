import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Evidencia, EvidenciaSchema } from 'src/schemas/evidencias';
import { EvidenciaService } from '../service/evidencia.service';
import { EvidenciaController } from '../controllers/evidencia.controller';
import { CaseModule } from './case.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evidencia.name, schema: EvidenciaSchema },
    ]),
    CaseModule,
    CloudinaryModule,
  ],
  controllers: [EvidenciaController],
  providers: [EvidenciaService],
})
export class EvidenciaModule {}
