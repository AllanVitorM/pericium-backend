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
  UseGuards,
} from '@nestjs/common';
import { LaudoService } from './laudo.service';
import {
  AssinarLaudoDTO,
  CreateLaudoDTO,
  UpdateLaudoDTO,
} from 'src/laudos/laudo.dto';
import { Laudo } from './laudo.schema';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';

// 🔽 Swagger imports
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Laudos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('laudos')
export class LaudoController {
  constructor(private readonly laudoService: LaudoService) {}

  @Roles(Role.ADMIN, Role.PERITO)
  @Post('createreport')
  @ApiOperation({ summary: 'Criar um novo laudo' })
  @ApiResponse({ status: 201, description: 'Laudo criado com sucesso' })
  async create(@Body() createLaudoDto: CreateLaudoDTO) {
    return this.laudoService.create(createLaudoDto);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get()
  @ApiOperation({ summary: 'Listar todos os laudos' })
  async findAll() {
    return this.laudoService.findAll();
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get('evidence/:id')
  @ApiOperation({ summary: 'Buscar laudo por evidência (ID)' })
  @ApiParam({ name: 'id', required: true })
  async findByEvidencia(@Param('id') id: string) {
    console.log('ID recebido no endpoint /evidence/:id =>', id);
    return this.laudoService.findbyEvidencia(id);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados do laudo' })
  @ApiParam({ name: 'id', required: true })
  async update(
    @Param('id') id: string,
    @Body() updateLaudoDTO: UpdateLaudoDTO,
  ): Promise<Laudo> {
    return this.laudoService.update(id, updateLaudoDTO);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Patch('sign/:id')
  @ApiOperation({ summary: 'Assinar laudo por ID' })
  @ApiParam({ name: 'id', required: true })
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
  @ApiOperation({ summary: 'Remover laudo por ID' })
  @ApiParam({ name: 'id', required: true })
  remove(@Param('id') id: string) {
    return this.laudoService.remove(id);
  }
}
