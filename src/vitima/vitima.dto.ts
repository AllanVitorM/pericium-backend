import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Etnia } from 'src/common/enums/etnia.enum';

export class CreateVitimaDTO {
  @IsString()
  @IsOptional()
  NIC: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  genero: string;

  @IsNumber()
  @IsNotEmpty()
  documento: number;

  @IsString()
  @IsNotEmpty()
  endereco: string;

  @IsEnum(Etnia)
  etnia: Etnia;
}

