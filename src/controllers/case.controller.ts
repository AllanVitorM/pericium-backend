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
import { CaseService } from 'src/service/case.service';
import { CreateCaseDTO, UpdateCaseDTO } from 'src/DTO/case.dto';

@Controller('cases')
export class CaseController {
  constructor(private readonly CaseService: CaseService) {}

  @Post()
  async create(@Body() createCaseDTO: CreateCaseDTO) {
    return this.CaseService.create(createCaseDTO);
  }

  @Get()
  async findAll() {
    return this.CaseService.findAll();
  }

  @Get('titulo/:titulo')
  async findOne(@Param('titulo') titulo: string) {
    return this.CaseService.findOne(titulo);
  }

  @Get('dataabertura/:dataabertura')
  async findByDataAbertura(@Param('dataabertura') DataAbertura: string) {
    const date = new Date(DataAbertura);

    if(isNaN(date.getTime())){
      throw new BadRequestException('Data Inválida.')
    }

    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    return this.CaseService.findOneDataAbertura(start, end);
  }

  @Put('titulo/:titulo')
  async updateCase(
    @Param('titulo') titulo: string,
    @Body() updateCaseDTO: UpdateCaseDTO,
  ) {
    return this.CaseService.update(titulo, updateCaseDTO);
  }
  @Put('descricao/:descricao')
  async updateByDescricao(
    @Param('descricao') descricao: string,
    @Body() updateCaseDTO: UpdateCaseDTO,
  ) {
    return this.CaseService.updateByDescricao(descricao, updateCaseDTO);
  }

  @Put(':titulo/datafechamento')
  async updateDataFechamento(
    @Param('titulo') titulo: string,
    @Body('dataFechamento') dataFechamentoStr: string,
  ) {
    const dataFechamento = new Date(dataFechamentoStr);
    return this.CaseService.updateByDataFechamento(titulo, dataFechamento);
  }

  @Delete('titulo/:titulo')
  async deleteCase(@Param('titulo') titulo: string) {
    const wasDeleted = await this.CaseService.remove(titulo);
    if (wasDeleted) {
      return { message: `Caso ${titulo} foi evaporado com sucesso!` };
    } else {
      return { message: `Caso ${titulo} deu fuga com sucesso!` };
    }
  }
  @Delete('descricao/:descricao')
  async deleteCaseBy(@Param('descricao') descricao: string) {
    const wasDeleted = await this.CaseService.removeByDescricao(descricao);
    if (wasDeleted) {
      return { message: `Caso ${descricao} foi evaporado com sucesso!` };
    } else {
      return { message: `Caso ${descricao} deu fuga com sucesso!` };
    }
  }
}
