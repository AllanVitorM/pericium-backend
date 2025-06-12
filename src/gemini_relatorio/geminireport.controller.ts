import { LaudoService } from '../laudos/laudo.service';
import { Controller, Post, Param } from '@nestjs/common';
import { GeminiServiceReport } from './geminireport.service';
import { RelatorioService } from 'src/relatorios/relatorio.service';
import { Request } from 'express';
import { Req } from '@nestjs/common';

@Controller('report')
export class GeminireportController {
  constructor(
    private readonly geminiService: GeminiServiceReport,
    private readonly relatorioService: RelatorioService,
    private readonly laudoService: LaudoService,
  ) {}

  @Post('gerar/:caseId')
  async gerarRelatorio(@Param('caseId') caseId: string, @Req() req: Request) {
    const userId = req.user?.id;
    return this.relatorioService.gerarRelatorioCompleto(caseId, userId);
  }
}
