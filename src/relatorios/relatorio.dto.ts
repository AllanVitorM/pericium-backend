import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRelatorioDTO {
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
  caseId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UpdateRelatorioDTO {
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

export class AssinarRelatorioDTO {
  @IsString()
  @IsNotEmpty()
  peritoId: string;
}
