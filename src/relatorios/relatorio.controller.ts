import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
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
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('relatorios')
export class RelatorioController {
  constructor(private readonly RelatorioService: RelatorioService) {}

  @Roles(Role.ADMIN, Role.PERITO)
  @Post('createreport')
  async create(@Body() createRelatorioDto: CreateRelatorioDTO) {
    return this.RelatorioService.create(createRelatorioDto);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get()
  async findAll() {
    return this.RelatorioService.findAll();
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get('case/:id')
  async findByCase(@Param('id') id: string) {
    return this.RelatorioService.findbyCase(id);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRelatorioDTO: UpdateRelatorioDTO,
  ): Promise<Relatorio> {
    return this.RelatorioService.update(id, updateRelatorioDTO);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Patch('sign/:id')
  async AssinarRelatorio(
    @Param('id') id: string,
    @Body() { peritoId }: AssinarRelatorioDTO,
  ) {
    const Relatorio = await this.RelatorioService.findOneById(id);

    if (!Relatorio) throw new NotFoundException('Relatorio não encontrado.');

    if (Relatorio.assinado) throw new Error('Relatorio já assinado');

    return this.RelatorioService.AssinarRelatorio(id, peritoId);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.RelatorioService.remove(id);
  }
}
