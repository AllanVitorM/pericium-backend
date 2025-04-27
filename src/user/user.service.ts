import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateUserDTO,
  UpdateUserDTO,
  AdminUpdateUserDTO,
} from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';
import generateRandomPassword from 'src/utils/passwordGenerator';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    createUserDTO: CreateUserDTO,
  ): Promise<{ user: User; temporaryPassword: string }> {
    try {
      const salt = await bcrypt.genSalt(10);
      const plainPassword: string = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(plainPassword, salt);

      const createUser = new this.userModel({
        ...createUserDTO,
        password: hashedPassword,
      });

      const savedUser = await createUser.save();

      return {
        user: savedUser,
        temporaryPassword: plainPassword,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao criar usuário.', error.message);
        throw new Error(error.message);
      } else {
        console.error('Erro desconhecido ao criar usuário.');
        throw new Error('Erro desconhecido ao criar usuário.');
      }
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(name: string): Promise<User | null> {
    return this.userModel.findOne({ name }).exec();
  }

  async findOneCpf(cpf: string): Promise<User | null> {
    return this.userModel.findOne({ cpf }).exec();
  }

  async update(
    cpf: string,
    data: Partial<UpdateUserDTO | AdminUpdateUserDTO>,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({ cpf });

    if (!user) return null;

    if (
      'password' in data &&
      data.password &&
      data.password !== user.password
    ) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    return this.userModel.findOneAndUpdate({ cpf }, data, { new: true }).exec();
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Senha antiga incorreta.');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    return true;
  }

  async remove(cpf: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ cpf }).exec();
    return result.deletedCount > 0;
  }
}
