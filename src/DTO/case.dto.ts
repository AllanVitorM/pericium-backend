import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateCaseDTO {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDateString()
  @IsNotEmpty()
  dataAbertura: Date;

  @IsDateString()
  @IsNotEmpty()
  dataFechamento: Date;

  @IsEnum(Role)
  role: Role;
}

export class UpdateCaseDTO {
  
  @IsString()
  @IsNotEmpty()
  titulo: string;
  
  @IsString()
  @IsNotEmpty()
  descricao: string;
  
  @IsString()
  @IsNotEmpty()
  status: string;
  
  @IsDateString()
  @IsNotEmpty()
  dataAbertura: Date;
  
  @IsDateString()
  @IsNotEmpty()
  dataFechamento: Date;
}