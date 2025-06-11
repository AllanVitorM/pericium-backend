import {
  Controller, Post, Body, Get, Param, Put, Patch, Delete, UseGuards
} from '@nestjs/common';
import { LaudoService } from './laudo.service';
import { CreateLaudoDTO, UpdateLaudoDTO, AssinarLaudoDTO } from './laudo.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Laudos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('laudos')
export class LaudoController {
  constructor(private readonly svc: LaudoService) {}

  @Roles(Role.ADMIN, Role.PERITO)
  @Post()
  @ApiOperation({ summary: 'Criar novo laudo' })
  create(@Body() dto: CreateLaudoDTO) {
    return this.svc.create(dto);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get()
  @ApiOperation({ summary: 'Listar todos os laudos' })
  findAll() {
    return this.svc.findAll();
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get('evidencia/:evidenciaId')
  @ApiOperation({ summary: 'Buscar laudo por evidência' })
  @ApiParam({ name: 'evidenciaId', required: true })
  findByEvidencia(@Param('evidenciaId') id: string) {
    return this.svc.findByEvidencia(id);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar laudo' })
  update(@Param('id') id: string, @Body() dto: UpdateLaudoDTO) {
    return this.svc.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Patch('sign/:id')
  @ApiOperation({ summary: 'Assinar laudo' })
  @ApiParam({ name: 'id', required: true })
  sign(@Param('id') id: string, @Body() dto: AssinarLaudoDTO) {
    return this.svc.sign(id, dto.peritoId);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover laudo' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
