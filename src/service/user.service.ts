import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "src/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose"; 
import { Model } from "mongoose";
import { CreateUserDTO } from "src/DTO/user.dto";


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async create(createUserDTO: CreateUserDTO): Promise<User> {
        const createUser = new this.userModel(createUserDTO);
        return createUser.save()
    }
}