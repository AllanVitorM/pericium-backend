import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLaudoDTO {
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty() @IsString() @IsNotEmpty() description: string;
  @ApiProperty() @IsString() @IsNotEmpty() evidenciaId: string;
  @ApiProperty() @IsString() @IsNotEmpty() userId: string;
}

export class UpdateLaudoDTO {
  @ApiProperty({ required: false }) @IsString() @IsOptional() title?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
}

export class AssinarLaudoDTO {
  @ApiProperty() @IsString() @IsNotEmpty() peritoId: string;
}
