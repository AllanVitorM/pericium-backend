import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Laudo, LaudoSchema } from './laudo.schema';
import { LaudoController } from './laudo.controller';
import { LaudoService } from './laudo.service';
import { PdfService } from './shared/pdf.service';
import { EvidenciaModule } from 'src/evidencias/evidencia.module';
import { GeminiModule } from 'src/gemini_laudo/gemini.module';
import { ReplicateModule } from 'src/replicate/replicate.module';
import { RelatorioModule } from 'src/relatorios/relatorio.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Laudo.name, schema: LaudoSchema }]),
    forwardRef(() => GeminiModule),
    EvidenciaModule,
    ReplicateModule,
    RelatorioModule,
  ],
  controllers: [LaudoController],
  providers: [LaudoService, PdfService],
  exports: [MongooseModule, LaudoService],
})
export class LaudoModule {}
