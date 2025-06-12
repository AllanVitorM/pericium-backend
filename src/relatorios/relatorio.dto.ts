import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRelatorioDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  conteudo: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pdfUrl?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  caseId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UpdateRelatorioDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pdfUrl?: string;
}

export class AssinarRelatorioDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  peritoId: string;
}
