import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Etnia } from 'src/common/enums/etnia.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVitimaDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  NIC: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  genero: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  documento: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endereco: string;

  @ApiProperty()
  @IsEnum(Etnia)
  etnia: Etnia;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  caseId: string;
}

export class UpdateVitimaDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  NIC: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  genero: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  documento: number;
}
