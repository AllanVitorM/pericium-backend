import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { CaseService } from 'src/cases/case.service';
import { CreateCaseDTO, UpdateCaseDTO } from 'src/cases/case.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cases')
export class CaseController {
  constructor(private readonly CaseService: CaseService) {}

  @Roles(Role.ADMIN, Role.PERITO)
  @Post('createcase')
  async create(@Body() createCaseDTO: CreateCaseDTO) {
    return this.CaseService.create(createCaseDTO);
  }
  @Roles(Role.ADMIN, Role.PERITO, Role.PERITO)
  @Get()
  async findAll() {
    return this.CaseService.findAll();
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.PERITO)
  @Get('titulo/:titulo')
  async findOne(@Param('titulo') titulo: string) {
    return this.CaseService.findOne(titulo);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.PERITO)
  @Get('dataabertura/:dataabertura')
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
  async updateCase(
    @Param('id') id: string,
    @Body() updateCaseDTO: UpdateCaseDTO,
  ) {
    return this.CaseService.update(id, updateCaseDTO);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Put(':id/datafechamento')
  async updateDataFechamento(
    @Param('id') id: string,
    @Body('dataFechamento') dataFechamentoStr: string,
  ) {
    const dataFechamento = new Date(dataFechamentoStr);
    return this.CaseService.updateByDataFechamento(id, dataFechamento);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Delete(':id')
  async deleteCase(@Param('id') id: string) {
    const wasDeleted = await this.CaseService.remove(id);
    if (wasDeleted) {
      return { message: `Caso ${id} foi evaporado com sucesso!` };
    } else {
      return { message: `Caso ${id} deu fuga com sucesso!` };
    }
  }
}
