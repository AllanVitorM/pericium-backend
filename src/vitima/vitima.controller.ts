import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VitimaService } from './vitima.service';
import { CreateVitimaDTO } from './vitima.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';

// 🔽 Swagger
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

  @Roles(Role.ADMIN)
  @Post('createvitima')
  @ApiOperation({ summary: 'Criar uma nova vitima' })
  @ApiResponse({ status: 201, description: 'Vítima criada com sucesso' })
  async create(@Body() createVitimaDTO: CreateVitimaDTO) {
    return this.vitimaService.create(createVitimaDTO);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de vítimas retornada' })
  async findAll() {
    return this.vitimaService.findAll();
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Get(':name')
  @ApiOperation({ summary: 'Buscar usuário por nome' })
  @ApiParam({ name: 'name', description: 'Nome do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado por nome' })
  async findOne(@Param('name') name: string) {
    return this.vitimaService.findOneById(name);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma vítima' })
  @ApiParam({ name: 'id', description: 'ID da vítima' })
  @ApiResponse({ status: 200, description: 'Vítima deletada com sucesso' })
  async deleteVitima(@Param('id') id: string) {
    const wasDeleted = (await this.vitimaService.findOneById(id)) === null;

    if (wasDeleted) {
      return { message: `Vítima ${id} foi evaporada com sucesso!` };
    } else {
      return { message: `Vítima ${id} deu fuga com sucesso!` };
    }
  }
}
