import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RelatorioService } from './relatorio.service';
import { CreateRelatorioDTO } from './relatorio.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Relatórios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('relatorios')
export class RelatorioController {
  constructor(private readonly svc: RelatorioService) {}

  @Post('CriarRelatorio/:caseId')
  @Roles(Role.ADMIN, Role.PERITO)
  @ApiParam({ name: 'caseId', required: true })
  @ApiOperation({ summary: 'Criar relatório por caso' })
  create(
    @Param('caseId') caseId: string,
    @Body() dto: CreateRelatorioDTO,
  ) {
    return this.svc.create(dto, caseId);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get('case/:caseId')
  @ApiOperation({ summary: 'Visualizar relatório por caso' })
  @ApiParam({ name: 'caseId', required: true })
  findByCaso(@Param('caseId') caseId: string) {
    return this.svc.findByCaso(caseId);
  }
}
