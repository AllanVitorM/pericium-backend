import { ApiProperty } from '@nestjs/swagger';

export class DashboardResumoDto {
  @ApiProperty()
  totalCasos: number;

  @ApiProperty()
  totalEvidencias: number;

  @ApiProperty()
  totalLaudos: number;

  @ApiProperty()
  casosPendentes: number;

  @ApiProperty()
  casosConcluidos: number;

  @ApiProperty()
  evidenciasSemLaudo: number;

  @ApiProperty()
  percentualEvidenciasComLaudo: number;

  @ApiProperty({ type: String, format: 'date-time', required: false })
  ultimoCasoCriado: string | null;
}
