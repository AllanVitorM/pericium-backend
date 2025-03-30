import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "src/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose"; 
import { Model } from "mongoose";
import { CreateUserDTO, UpdateUserDTO } from "src/DTO/user.dto";


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async create(createUserDTO: CreateUserDTO): Promise<User> {
        const createUser = new this.userModel(createUserDTO);
        return createUser.save()
    }
    
    async findAll() : Promise<User[]> { 
        return this.userModel.find().exec();

     }

    async findOne(name: string): Promise<User | null> {
        return this.userModel.findOne({name}).exec();
    }

    async update(name: string, updateUserDTO: UpdateUserDTO): Promise<User | null> {
        return this.userModel.findOneAndUpdate({ name: name }, updateUserDTO, { new: true }).exec();
    }
    
}