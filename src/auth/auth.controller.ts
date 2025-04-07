import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from 'src/schemas/user.schema';
import { jwtpayload } from './interfaces/jwt.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { cpf: string; password: string }) {
    const user: UserDocument | null = await this.authService.validateUser(
      body.cpf,
      body.password,
    );

    if (!user) {
      throw new UnauthorizedException('Usuário inválido!');
    }
    const payload: jwtpayload = {
      sub: user._id.toString(),
      cpf: user.cpf,
      role: user.role,
    };
    return this.authService.login(payload);
  }
}
