import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEvidenciaDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tipo?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  local?: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dateRegister: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  caseId: string;
}

export class updateEvidenciaDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  local?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tipo?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
