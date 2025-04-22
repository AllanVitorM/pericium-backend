import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(Role)
  role: Role;
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;
}

export class AdminUpdateUserDTO {
  @IsString()
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  password?: string;
}

export class ChangePasswordDTO {
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
