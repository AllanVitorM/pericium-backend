import {
  Controller,
  Post,
  Get,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwtAuthGuard';
import { LocalAuthGuard } from './localAuthGuard';
import { AuthenticatedRequest } from 'src/types/authenticatedRequest';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: AuthenticatedRequest) {
    console.log('🧪 req.user:', req.user);

    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('Usuário inválido!');
    }

    const payload = {
      sub: user.id,
      cpf: user.cpf,
      role: user.role,
    };

    const { access_token } = this.authService.login(payload);
    console.log('Token gerado no backend:', access_token);

    return { token: access_token, user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: AuthenticatedRequest) {
    const user: AuthenticatedRequest['user'] = req.user;

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    console.log('👤 req.user no backend:', req.user);

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      cpf: user.cpf,
      email: user.email,
    };
  }
}
