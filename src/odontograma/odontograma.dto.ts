import { IsString, IsOptional } from 'class-validator';

export class CreateOdontogramaDTO {
  @IsString()
  @IsOptional()
  dentes: string;

  @IsString()
  @IsOptional()
  observacoes: string;
}
