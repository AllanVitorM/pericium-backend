import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Evidencia, EvidenciaSchema } from 'src/evidencias/evidencias.schema';
import { EvidenciaService } from './evidencia.service';
import { EvidenciaController } from './evidencia.controller';
import { CaseModule } from '../cases/case.module';
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
  exports: [MongooseModule, EvidenciaService],
})
export class EvidenciaModule {}
