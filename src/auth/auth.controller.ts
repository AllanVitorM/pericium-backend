import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Request,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwtAuthGuard';
import { LocalAuthGuard } from './localAuthGuard';
import { AuthenticatedRequest } from 'src/types/authenticatedRequest';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

// ✅ DTO declarada FORA do controller
export class UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário e gerar token JWT' })
  @ApiResponse({ status: 201, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Usuário inválido' })
  login(@Request() req: AuthenticatedRequest) {
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
    return { token: access_token, user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retornar dados do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário retornado' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  getProfile(@Request() req: AuthenticatedRequest) {
    const user: AuthenticatedRequest['user'] = req.user;

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      cpf: user.cpf,
      email: user.email,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar senha do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Senha atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Senha atual incorreta' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  async updatePassword(
    @Request() req: AuthenticatedRequest,
    @Body() body: UpdatePasswordDto,
  ) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const { oldPassword, newPassword } = body;

    await this.authService.updatePassword(user.id, oldPassword, newPassword);

    return { message: 'Senha atualizada com sucesso.' };
  }
}
