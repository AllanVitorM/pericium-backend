import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RelatorioService } from './relatorio.service';
import {
  CreateRelatorioDTO,
  UpdateRelatorioDTO,
} from 'src/relatorios/relatorio.dto';
import { Relatorio } from './relatorio.schema';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';

// Swagger
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Relatórios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('relatorios')
export class RelatorioController {
  constructor(private readonly RelatorioService: RelatorioService) {}

  @Post('createreport')
  @Roles(Role.ADMIN, Role.PERITO)
  @ApiOperation({ summary: 'Criar um novo relatório' })
  @ApiBody({ type: CreateRelatorioDTO })
  @ApiResponse({ status: 201, description: 'Relatório criado com sucesso' })
  async create(@Body() createRelatorioDto: CreateRelatorioDTO) {
    return this.RelatorioService.create(createRelatorioDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @ApiOperation({ summary: 'Listar todos os relatórios' })
  @ApiResponse({ status: 200, description: 'Lista de relatórios retornada' })
  async findAll() {
    return this.RelatorioService.findAll();
  }

  @Get('case/:id')
  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @ApiOperation({ summary: 'Buscar relatórios por ID de caso' })
  @ApiParam({ name: 'id', required: true, description: 'ID do caso' })
  async findByCase(@Param('id') id: string) {
    return this.RelatorioService.findbyCase(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.PERITO)
  @ApiOperation({ summary: 'Atualizar relatório por ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID do relatório' })
  @ApiBody({ type: UpdateRelatorioDTO })
  @ApiResponse({ status: 200, description: 'Relatório atualizado com sucesso' })
  async update(
    @Param('id') id: string,
    @Body() updateRelatorioDTO: UpdateRelatorioDTO,
  ): Promise<Relatorio> {
    return this.RelatorioService.update(id, updateRelatorioDTO);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PERITO)
  @ApiOperation({ summary: 'Remover relatório por ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID do relatório' })
  @ApiResponse({ status: 200, description: 'Relatório removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.RelatorioService.remove(id);
  }
}
