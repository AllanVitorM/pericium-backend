import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OdontogramaService } from './odontograma.service';
import { CreateOdontogramaDTO } from './odontograma.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Odontograma')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('odontograma')
export class OdontogramaController {
  constructor(private readonly odontogramaService: OdontogramaService) {}

  @Roles(Role.ADMIN, Role.PERITO)
  @Post('createodontograma')
  @ApiOperation({ summary: 'Criar um novo odontograma' })
  @ApiResponse({ status: 201, description: 'Odontograma criado com sucesso' })
  async create(@Body() createOdontogramaDTO: CreateOdontogramaDTO) {
    return this.odontogramaService.create(createOdontogramaDTO);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Get()
  @ApiOperation({ summary: 'Listar todos os odontogramas' })
  @ApiResponse({ status: 200, description: 'Lista de odontograma retornada' })
  async findAll() {
    return this.odontogramaService.findAll();
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get('vitima/:vitimaId')
  @ApiOperation({ summary: 'Listar odontograma por ID de Vitima' })
  @ApiParam({ name: 'vitimaId', required: true })
  findByVitimaId(@Param('vitimaId') vitimaId: string) {
    return this.odontogramaService.findByVitimaId(vitimaId);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um odontograma' })
  @ApiParam({ name: 'id', description: 'ID do odontograma' })
  @ApiResponse({ status: 200, description: 'Odontograma deletada com sucesso' })
  async deleteOdontograma(@Param('id') id: string) {
    return this.odontogramaService.remove(id);
  }
}
