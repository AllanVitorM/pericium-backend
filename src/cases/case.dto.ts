import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Status } from 'src/common/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCaseDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titulo: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: Status;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dataAbertura: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UpdateCaseDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  titulo?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: Status;
}
