import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLaudoDTO {
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
  evidenciaId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UpdateLaudoDTO {
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

export class AssinarLaudoDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  peritoId: string;
}
