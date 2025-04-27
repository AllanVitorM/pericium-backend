import { Controller, Get, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumo')
  @ApiResponse({
    status: 200,
    description: 'Dados agregados do dashboard',
    schema: {
      type: 'object',
      properties: {
        porStatus: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'Em andamento' },
              total: { type: 'integer', example: 12 },
            },
          },
        },
        porTipo: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              tipo: { type: 'string', example: 'Vítima' },
              total: { type: 'integer', example: 8 },
            },
          },
        },
        totalEvidencias: {
          type: 'integer',
          example: 15,
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async getDashboardResumo() {
    try {
      const result = await this.dashboardService.getDashboardResumo();
      return {
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Erro interno do servidor',
      };
    }
  }
}
