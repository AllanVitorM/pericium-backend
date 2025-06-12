import { Module, forwardRef } from '@nestjs/common';
import { EvidenciaModule } from 'src/evidencias/evidencia.module';
import { LaudoModule } from 'src/laudos/laudo.module';
import { RelatorioModule } from 'src/relatorios/relatorio.module';
import { GeminiServiceReport } from './geminireport.service';
import { GeminireportController } from './geminireport.controller';
@Module({
  imports: [
    forwardRef(() => EvidenciaModule),
    forwardRef(() => LaudoModule),
    forwardRef(() => RelatorioModule),
  ],
  controllers: [GeminireportController],
  providers: [GeminiServiceReport],
  exports: [GeminiServiceReport],
})
export class GeminiReportModule {}
