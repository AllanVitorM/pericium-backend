import { Controller, Get, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardResumoDto } from './dashboard.dto'; // seu DTO

@ApiTags('Dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumo')
  @ApiResponse({
    status: 200,
    description: 'Resumo dos dados do dashboard',
    type: DashboardResumoDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async getDashboardResumo() {
    try {
      const data = await this.dashboardService.getDashboardResumo();
      return {
        statusCode: HttpStatus.OK,
        message: 'Resumo obtido com sucesso',
        data,
      };
    } catch (error) {
      console.error('[DashboardController] Erro:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro interno ao obter resumo do dashboard',
        error: error.message || 'Internal Server Error',
      };
    }
  }
}
