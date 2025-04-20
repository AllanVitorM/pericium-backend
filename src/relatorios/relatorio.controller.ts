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
import { RelatorioService } from './relatorio.service';
import {
  AssinarRelatorioDTO,
  CreateRelatorioDTO,
  UpdateRelatorioDTO,
} from 'src/relatorios/relatorio.dto';
import { Relatorio } from './relatorio.schema';

@Controller('relatorios')
export class RelatorioController {
  constructor(private readonly RelatorioService: RelatorioService) {}

  @Post()
  async create(@Body() createRelatorioDto: CreateRelatorioDTO) {
    return this.RelatorioService.create(createRelatorioDto);
  }

  @Get()
  async findAll() {
    return this.RelatorioService.findAll();
  }

  @Get('caso/:id')
  async findByCase(@Param('id') id: string) {
    return this.RelatorioService.findbyCase(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRelatorioDTO: UpdateRelatorioDTO,
  ): Promise<Relatorio> {
    return this.RelatorioService.update(id, updateRelatorioDTO);
  }

  @Patch('assinar/:id')
  async AssinarRelatorio(
    @Param('id') id: string,
    @Body() { peritoId }: AssinarRelatorioDTO,
  ) {
    const Relatorio = await this.RelatorioService.findOneById(id);

    if (!Relatorio) throw new NotFoundException('Relatorio não encontrado.');

    if (Relatorio.assinado) throw new Error('Relatorio já assinado');

    return this.RelatorioService.AssinarRelatorio(id, peritoId);
  }
}
