import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Request,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  AdminUpdateUserDTO,
  CreateUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
} from 'src/user/user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthenticatedRequest } from 'src/types/authenticatedRequest';

// 🔽 Swagger
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Usuários')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Post('createuser')
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  async create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada' })
  async findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':name')
  @ApiOperation({ summary: 'Buscar usuário por nome' })
  @ApiParam({ name: 'name', description: 'Nome do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado por nome' })
  async findOne(@Param('name') name: string) {
    return this.userService.findOne(name);
  }

  @Roles(Role.ADMIN)
  @Get(':cpf')
  @ApiOperation({ summary: 'Buscar usuário por CPF' })
  @ApiParam({ name: 'cpf', description: 'CPF do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado por CPF' })
  async findOneCpf(@Param('cpf') cpf: string) {
    return this.userService.findOne(cpf);
  }

  @Roles(Role.ADMIN)
  @Put('admin/:cpf')
  @ApiOperation({ summary: 'Atualizar usuário como ADMIN' })
  @ApiParam({ name: 'cpf', description: 'CPF do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  async updateUserAsAdmin(
    @Param('cpf') cpf: string,
    @Body() adminUpdateUserDTO: AdminUpdateUserDTO,
  ) {
    return this.userService.update(cpf, adminUpdateUserDTO);
  }

  @Roles(Role.PERITO, Role.ASSISTENTE)
  @Put(':cpf')
  @ApiOperation({ summary: 'Atualizar usuário (PERITO ou ASSISTENTE)' })
  @ApiParam({ name: 'cpf', description: 'CPF do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  async updateUser(
    @Param('cpf') cpf: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return this.userService.update(cpf, updateUserDTO);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Patch('changepassword')
  @ApiOperation({ summary: 'Trocar senha do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() body: ChangePasswordDTO,
  ) {
    const { id } = req.user;
    return this.userService.changePassword(
      id,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Roles(Role.ADMIN)
  @Delete(':cpf')
  @ApiOperation({ summary: 'Deletar um usuário' })
  @ApiParam({ name: 'cpf', description: 'CPF do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  async deleteUser(@Param('cpf') cpf: string) {
    const wasDeleted = await this.userService.remove(cpf);
    if (wasDeleted) {
      return { message: `Usuário ${cpf} foi evaporado com sucesso!` };
    } else {
      return { message: `Usuário ${cpf} deu fuga com sucesso!` };
    }
  }
}
