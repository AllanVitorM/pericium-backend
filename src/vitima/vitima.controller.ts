import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VitimaService } from './vitima.service';
import { CreateVitimaDTO, UpdateVitimaDTO } from './vitima.dto';
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

@ApiTags('Vitimas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vitimas')
export class VitimaController {
  constructor(private readonly vitimaService: VitimaService) {}

  @Roles(Role.ADMIN, Role.PERITO)
  @Post('createvitima')
  @ApiOperation({ summary: 'Criar uma nova vítima' })
  @ApiResponse({ status: 201, description: 'Vítima criada com sucesso' })
  async create(@Body() createVitimaDTO: CreateVitimaDTO) {
    return this.vitimaService.create(createVitimaDTO);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get()
  @ApiOperation({ summary: 'Listar todas as vítimas' })
  @ApiResponse({ status: 200, description: 'Lista de vítimas retornada' })
  async findAll() {
    return this.vitimaService.findAll();
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar vítima por ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Vítima encontrada' })
  async findOne(@Param('id') id: string) {
    return this.vitimaService.findOneById(id);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get('bycase/:caseId')
  @ApiOperation({ summary: 'Listar vítimas por ID do caso' })
  @ApiParam({ name: 'caseId', required: true })
  async findByCaseId(@Param('caseId') caseId: string) {
    return this.vitimaService.findByCaseId(caseId);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Patch('update/:id')
  @ApiOperation({ summary: 'Atualizar dados da vítima' })
  @ApiParam({ name: 'id', required: true })
  async update(@Param('id') id: string, @Body() dto: UpdateVitimaDTO) {
    return this.vitimaService.updateVitima(id, dto);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma vítima' })
  @ApiParam({ name: 'id', description: 'ID da vítima' })
  @ApiResponse({ status: 200, description: 'Vítima deletada com sucesso' })
  async deleteVitima(@Param('id') id: string) {
    await this.vitimaService.remove(id);
    return { message: `Vítima ${id} foi deletada com sucesso!` };
  }
}
