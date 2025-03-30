import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDTO{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    senha: string;

    @IsEnum(Role)
    role: Role;
}

export class UpdateUserDTO{
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    senha?: string;
}