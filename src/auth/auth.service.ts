import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtpayload } from './interfaces/jwt.interface';
import { Model } from 'mongoose';
import { UserDocument, User } from 'src/schemas/user.schema';
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
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  login(user: jwtpayload) {
    const payload = {
      sub: user.sub,
      cpf: user.cpf,
      role: user.role,
    };
    return {
      access_token: this.jwtservice.sign(payload),
    };
  }
}
