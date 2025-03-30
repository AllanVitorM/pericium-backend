import { Body, Controller, Post, Get, Put, Delete } from "@nestjs/common";
import { UserService } from "src/service/user.service";
import { CreateUserDTO } from "src/DTO/user.dto";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO){
        return this.userService.create(createUserDTO);
    }
}