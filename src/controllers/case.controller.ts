import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
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

  @Get(':titulo')
  async findOne(@Param('titulo') titulo: string) {
    return this.CaseService.findOne(titulo);
  }

  @Get(':descricao')
  async findByDescricao(@Param('descricao') descricao: string) {
    return this.CaseService.findOne(descricao);
  }

  @Put(':titulo')
  async updateCase(
    @Param('titulo') titulo: string,
    @Body() updateCaseDTO: UpdateCaseDTO,
  ) {
    return this.CaseService.update(titulo, updateCaseDTO);
  } 
  async updateByDescricao(
    @Param('descricao') descricao: string,
    @Body() updateCaseDTO: UpdateCaseDTO,
  ) {
    return this.CaseService.update(descricao, updateCaseDTO);
  }

  @Delete(':titulo')
  async deleteCase(@Param('titulo') titulo: string) {
    const wasDeleted = await this.CaseService.remove(titulo);
    if (wasDeleted) {
      return { message: `Caso ${titulo} foi evaporado com sucesso!` };
    } else {
      return { message: `Caso ${titulo} deu fuga com sucesso!` };
    }
  } 
  async deleteCaseBy(@Param('descricao') descricao: string) {
    const wasDeleted = await this.CaseService.remove(descricao);
    if (wasDeleted) {
      return { message: `Caso ${descricao} foi evaporado com sucesso!` };
    } else {
      return { message: `Caso ${descricao} deu fuga com sucesso!` };
    }
  }
}
