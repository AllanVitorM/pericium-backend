import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  AdminUpdateUserDTO,
  CreateUserDTO,
  UpdateUserDTO,
} from 'src/user/user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Post('createuser')
  async create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
  @Roles(Role.ADMIN)
  @Get(':name')
  async findOne(@Param('name') name: string) {
    return this.userService.findOne(name);
  }
  @Roles(Role.ADMIN)
  @Get(':cpf')
  async findOneCpf(@Param('cpf') cpf: string) {
    return this.userService.findOne(cpf);
  }

  @Roles(Role.ADMIN)
  @Put('admin/:cpf')
  async updateUserAsAdmin(
    @Param('cpf') cpf: string,
    @Body() adminUpdateUserDTO: AdminUpdateUserDTO,
  ) {
    return this.userService.update(cpf, adminUpdateUserDTO);
  }

  @Roles(Role.PERITO, Role.ASSISTENTE)
  @Put(':cpf')
  async updateUser(
    @Param('cpf') cpf: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return this.userService.update(cpf, updateUserDTO);
  }

  @Roles(Role.ADMIN)
  @Delete(':cpf')
  async deleteUser(@Param('cpf') cpf: string) {
    const wasDeleted = await this.userService.remove(cpf);
    if (wasDeleted) {
      return { message: `Usuário ${cpf} foi evaporado com sucesso!` };
    } else {
      return { message: `Usuário ${cpf} deu fuga com sucesso!` };
    }
  }
}
