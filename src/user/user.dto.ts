import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(Role)
  role: Role;
}

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;
}

export class AdminUpdateUserDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  role?: Role;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;
}

export class ChangePasswordDTO {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}
