import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO, UpdateUserDTO } from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);
    const createUser = new this.userModel({
      ...createUserDTO,
      password: hashedPassword,
    });
    return createUser.save();
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
    updateUserDTO: UpdateUserDTO,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({ cpf });

    if (!user) return null;

    if (updateUserDTO.password && updateUserDTO.password !== user.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDTO.password = await bcrypt.hash(updateUserDTO.password, salt);
    }

    return this.userModel
      .findOneAndUpdate({ cpf }, updateUserDTO, { new: true })
      .exec();
  }

  async remove(cpf: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ cpf }).exec();
    return result.deletedCount > 0;
  }
}
