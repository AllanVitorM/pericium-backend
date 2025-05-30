import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateOdontogramaDTO {
  @IsString()
  @IsOptional()
  dentes: string;

  @IsString()
  @IsOptional()
  observacoes: string;

  @IsString()
  @IsNotEmpty()
  vitimaId: string;
}

export class UpdateOdontogramaDTO {
  @IsString()
  @IsOptional()
  observacoes: string;
}
