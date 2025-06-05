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
  async findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':name')
  @ApiOperation({ summary: 'Buscar usuário por nome' })
  @ApiParam({ name: 'name' })
  async findOne(@Param('name') name: string) {
    return this.userService.findOne(name);
  }

  @Roles(Role.ADMIN)
  @Put('admin/:cpf')
  @ApiOperation({ summary: 'Atualizar usuário como ADMIN' })
  @ApiParam({ name: 'cpf' })
  async updateUserAsAdmin(
    @Param('cpf') cpf: string,
    @Body() adminUpdateUserDTO: AdminUpdateUserDTO,
  ) {
    return this.userService.update(cpf, adminUpdateUserDTO);
  }

  @Roles(Role.PERITO, Role.ASSISTENTE)
  @Patch(':cpf')
  @ApiOperation({ summary: 'Atualizar usuário (PERITO ou ASSISTENTE)' })
  @ApiParam({ name: 'cpf' })
  async updateUser(
    @Param('cpf') cpf: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return this.userService.update(cpf, updateUserDTO);
  }

  @Roles(Role.ADMIN, Role.PERITO)
  @Patch('changepassword')
  @ApiOperation({ summary: 'Trocar senha do usuário autenticado' })
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
  @ApiParam({ name: 'cpf' })
  async deleteUser(@Param('cpf') cpf: string) {
    const wasDeleted = await this.userService.remove(cpf);
    if (wasDeleted) {
      return { message: `Usuário ${cpf} foi evaporado com sucesso!` };
    } else {
      return { message: `Usuário ${cpf} deu fuga com sucesso!` };
    }
  }
}
