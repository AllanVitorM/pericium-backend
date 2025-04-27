import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { CaseModule } from '../cases/case.module'; // <-- importa o módulo do case

@Module({
  imports: [CaseModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
