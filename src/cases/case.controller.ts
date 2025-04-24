import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CaseService } from 'src/cases/case.service';
import { CreateCaseDTO, UpdateCaseDTO } from 'src/cases/case.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';

// 🔽 Swagger
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Casos')
@ApiBearerAuth() // Habilita JWT no Swagger
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cases')
export class CaseController {
  constructor(private readonly CaseService: CaseService) {}

  @Roles(Role.ADMIN, Role.PERITO)
  @Post('createcase')
  @ApiOperation({ summary: 'Criar um novo caso' })
  @ApiResponse({ status: 201, description: 'Caso criado com sucesso' })
  async create(@Body() createCaseDTO: CreateCaseDTO) {
    return this.CaseService.create(createCaseDTO);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Get()
  @ApiOperation({ summary: 'Listar todos os casos' })
  @ApiResponse({ status: 200, description: 'Lista de casos retornada' })
  async findAll() {
    return this.CaseService.findAll();
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar caso por ID' })
  @ApiParam({ name: 'id', description: 'ID do caso' })
  @ApiResponse({ status: 200, description: 'Caso encontrado' })
  async findOne(@Param('id') id: string) {
    return this.CaseService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Get('dataabertura/:dataabertura')
  @ApiOperation({ summary: 'Buscar casos pela data de abertura' })
  @ApiParam({ name: 'dataabertura', description: 'Data no formato YYYY-MM-DD' })
  @ApiResponse({ status: 200, description: 'Casos encontrados' })
  async findByDataAbertura(@Param('dataabertura') DataAbertura: string) {
    const date = new Date(DataAbertura);

    if (isNaN(date.getTime())) {
      throw new BadRequestException('Data Inválida.');
    }

    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    return this.CaseService.findOneDataAbertura(start, end);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um caso' })
  @ApiParam({ name: 'id', description: 'ID do caso' })
  @ApiResponse({ status: 200, description: 'Caso atualizado com sucesso' })
  async updateCase(
    @Param('id') id: string,
    @Body() updateCaseDTO: UpdateCaseDTO,
  ) {
    return this.CaseService.update(id, updateCaseDTO);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Put(':id/datafechamento')
  @ApiOperation({ summary: 'Atualizar a data de fechamento do caso' })
  @ApiParam({ name: 'id', description: 'ID do caso' })
  @ApiResponse({ status: 200, description: 'Data de fechamento atualizada' })
  async updateDataFechamento(
    @Param('id') id: string,
    @Body('dataFechamento') dataFechamentoStr: string,
  ) {
    const dataFechamento = new Date(dataFechamentoStr);
    return this.CaseService.updateByDataFechamento(id, dataFechamento);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um caso' })
  @ApiParam({ name: 'id', description: 'ID do caso' })
  @ApiResponse({ status: 200, description: 'Caso deletado com sucesso' })
  async deleteCase(@Param('id') id: string) {
    const wasDeleted = await this.CaseService.remove(id);
    if (wasDeleted) {
      return { message: `Caso ${id} foi evaporado com sucesso!` };
    } else {
      return { message: `Caso ${id} deu fuga com sucesso!` };
    }
  }
}
