import { LaudoService } from './../laudos/laudo.service';
import { EvidenciaService } from './../evidencias/evidencia.service';
import { Controller, Post, Param, NotFoundException } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('laudo')
export class GeminiController {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly evidenciaService: EvidenciaService,

    private readonly laudoService: LaudoService,
  ) {}

  @Post('gerar/:evidenciaId')
  async gerarLaudo(@Param('evidenciaId') id: string) {
    return this.laudoService.gerarLaudoPorEvidencia(id);
  }
}
