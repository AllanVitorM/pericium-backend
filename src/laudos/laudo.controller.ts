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
import { LaudoService } from './laudo.service';
import {
  AssinarLaudoDTO,
  CreateLaudoDTO,
  UpdateLaudoDTO,
} from 'src/laudos/laudo.dto';
import { Laudo } from './laudo.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('laudos')
export class LaudoController {
  constructor(private readonly laudoService: LaudoService) {}

  @Roles(Role.ADMIN, Role.PERITO)
  @Post('createreport')
  async create(@Body() createLaudoDto: CreateLaudoDTO) {
    return this.laudoService.create(createLaudoDto);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get()
  async findAll() {
    return this.laudoService.findAll();
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get('evidencia/:id')
  async findByEvidencia(@Param('id') id: string) {
    return this.laudoService.findbyEvidencia(id);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLaudoDTO: UpdateLaudoDTO,
  ): Promise<Laudo> {
    return this.laudoService.update(id, updateLaudoDTO);
  }

  @Roles(Role.ADMIN, Role.PERITO)
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

  @Roles(Role.ADMIN, Role.PERITO)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laudoService.remove(id);
  }
}
