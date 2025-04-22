import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLaudoDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsOptional()
  pdfUrl?: string;

  @IsString()
  @IsNotEmpty()
  evidenciaId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UpdateLaudoDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  pdfUrl?: string;
}

export class AssinarLaudoDTO {
  @IsString()
  @IsNotEmpty()
  peritoId: string;
}
