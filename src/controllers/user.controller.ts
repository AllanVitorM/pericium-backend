import { Body, Controller, Post, Get, Put, Delete, Param } from "@nestjs/common";
import { UserService } from "src/service/user.service";
import { CreateUserDTO, UpdateUserDTO } from "src/DTO/user.dto";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO){
        return this.userService.create(createUserDTO);
    }


    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':name')
    async findOne(@Param('name') name: string){
        return this.userService.findOne(name);
     }
    
     @Put(':name')
     async updateUser(@Param('name') name: string, @Body() updateUserDTO: UpdateUserDTO) {
         return this.userService.update(name, updateUserDTO);
     }
     
}

