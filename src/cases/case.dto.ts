import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Status } from 'src/common/enums/status.enum';

export class CreateCaseDTO {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsNotEmpty()
  status: Status;

  @IsDateString()
  @IsNotEmpty()
  dataAbertura: Date;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UpdateCaseDTO {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  status?: Status;
}
