import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { LaudoService } from './laudo.service';
import {
  AssinarLaudoDTO,
  CreateLaudoDTO,
  UpdateLaudoDTO,
} from 'src/laudos/laudo.dto';
import { Laudo } from './laudo.schema';

@Controller('laudos')
export class LaudoController {
  constructor(private readonly laudoService: LaudoService) {}

  @Post()
  async create(@Body() createLaudoDto: CreateLaudoDTO) {
    return this.laudoService.create(createLaudoDto);
  }

  @Get()
  async findAll() {
    return this.laudoService.findAll();
  }

  @Get('evidencia/:id')
  async findByEvidencia(@Param('id') id: string) {
    return this.laudoService.findbyEvidencia(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLaudoDTO: UpdateLaudoDTO,
  ): Promise<Laudo> {
    return this.laudoService.update(id, updateLaudoDTO);
  }

  @Patch('assinar/:id')
  async AssinarLaudo(
    @Param('id') id: string,
    @Body() { peritoId }: AssinarLaudoDTO,
  ) {
    const laudo = await this.laudoService.findOneById(id);

    if (!laudo) throw new NotFoundException('Laudo não encontrado.');

    if (laudo.assinado) throw new Error('Laudo já assinado');

    return this.laudoService.AssinarLaudo(id, peritoId);
  }
}
