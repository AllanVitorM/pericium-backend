/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from 'src/user/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'cpf',
      passwordField: 'password',
    });
  }

  async validate(cpf: string, password: string): Promise<UserDocument> {
    const user = await this.authService.validateUser(cpf, password);
    console.log('🧪 Usuário encontrado:', user);
    if (!user) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }
    return user;
  }
}
