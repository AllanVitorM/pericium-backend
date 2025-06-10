import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Laudo, LaudoSchema } from './laudo.schema';
import { LaudoController } from './laudo.controller';
import { LaudoService } from './laudo.service';
import { PdfService } from './shared/pdf.service';
import { EvidenciaModule } from 'src/evidencias/evidencia.module';
import { GeminiModule } from 'src/gemini/gemini.module';
import { ReplicateModule } from 'src/replicate/replicate.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Laudo.name, schema: LaudoSchema }]),
    forwardRef(() => GeminiModule),
    EvidenciaModule,
    ReplicateModule,
  ],
  controllers: [LaudoController],
  providers: [LaudoService, PdfService],
  exports: [MongooseModule, LaudoService],
})
export class LaudoModule {}
