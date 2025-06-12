import { LaudoService } from '../laudos/laudo.service';
import { Controller, Post, Param } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { RelatorioService } from 'src/relatorios/relatorio.service';

@Controller('laudo')
export class GeminiController {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly relatorioService: RelatorioService,
    private readonly laudoService: LaudoService,
  ) {}

  @Post('gerar/:evidenciaId')
  async gerarLaudo(@Param('evidenciaId') id: string) {
    return this.laudoService.gerarLaudoPorEvidencia(id);
  }

}
