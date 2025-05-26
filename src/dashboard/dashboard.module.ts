import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CaseModule } from 'src/cases/case.module';
import { LaudoModule } from 'src/laudos/laudo.module';
import { EvidenciaModule } from 'src/evidencias/evidencia.module';
import { DashboardController } from './dashboard.controller'; // Importe o módulo do modelo Evidencia

@Module({
  imports: [CaseModule, LaudoModule, EvidenciaModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
