import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

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
}

export class UpdateCaseDTO {
  @IsString()
  @IsNotEmpty()
  titulo?: string;

  @IsString()
  @IsNotEmpty()
  descricao?: string;

  @IsString()
  @IsNotEmpty()
  status?: string;
}
