import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RelatorioSchema } from './relatorio.schema';
import { RelatorioController } from './relatorio.controller';
import { RelatorioService } from './relatorio.service';
import { PdfService } from './shared/pdf.service';
import { CaseModule } from 'src/cases/case.module';
import { EvidenciaModule } from 'src/evidencias/evidencia.module';
import { LaudoModule } from 'src/laudos/laudo.module';
import { VitimaModule } from 'src/vitima/vitima.module';
import { OdontogramaModule } from 'src/odontograma/odontograma.module';
import { GeminiModule } from 'src/gemini_laudo/gemini.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Relatorio', schema: RelatorioSchema }]),
    forwardRef(() => CaseModule),
    forwardRef(() => EvidenciaModule),
    forwardRef(() => LaudoModule),
    VitimaModule,
    OdontogramaModule,
    forwardRef(() => GeminiModule),
  ],
  controllers: [RelatorioController],
  providers: [RelatorioService, PdfService],
  exports: [RelatorioService],
})
export class RelatorioModule {}
