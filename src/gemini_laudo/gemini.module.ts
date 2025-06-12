import { Module, forwardRef } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { EvidenciaModule } from 'src/evidencias/evidencia.module';
import { LaudoModule } from 'src/laudos/laudo.module';
import { RelatorioModule } from 'src/relatorios/relatorio.module';

@Module({
  imports: [
    forwardRef(() => EvidenciaModule),
    forwardRef(() => LaudoModule),
    forwardRef(() => RelatorioModule),
  ],
  controllers: [GeminiController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
