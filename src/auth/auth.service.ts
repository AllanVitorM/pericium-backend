import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtpayload } from './interfaces/jwt.interface';
import { Model } from 'mongoose';
import { UserDocument, User } from 'src/user/user.schema';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtservice: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(
    cpf: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ cpf });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return user;
      }
    }
    return null;
  }

  login(user: jwtpayload) {
    const payload = {
      sub: user.sub,
      cpf: user.cpf,
      role: user.role,
    };
    const token = this.jwtservice.sign(payload);
    return {
      access_token: token,
    };
  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Senha atual incorreta.');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    return { message: 'Senha atualizada com sucesso.' };
  }
}
