import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { UserService } from 'src/service/user.service';
import { CreateUserDTO, UpdateUserDTO } from 'src/DTO/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return this.userService.findOne(name);
  }

  @Get(':cpf')
  async findOneCpf(@Param('cpf') cpf: string) {
    return this.userService.findOne(cpf);
  }

  @Put(':cpf')
  async updateUser(
    @Param('cpf') cpf: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return this.userService.update(cpf, updateUserDTO);
  }

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
