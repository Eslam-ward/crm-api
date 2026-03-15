import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/roles.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IDashboardResponse } from './interfaces/dashboardResponse.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'admin', 'sales')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get full dashboard overview' })
  @ApiResponse({ status: 200, description: 'Dashboard data' })
  async getDashboard(): Promise<IDashboardResponse> {
    return this.dashboardService.getDashboard();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get general statistics' })
  @ApiResponse({ status: 200, description: 'Stats data', type: Object })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('sales-overview')
  @ApiOperation({ summary: 'Get last 6 months sales overview' })
  @ApiResponse({ status: 200, description: 'Sales overview' })
  async getSalesOverview() {
    return this.dashboardService.getSalesOverview();
  }

  @Get('top-areas')
  @ApiOperation({ summary: 'Get top 5 areas by units sold' })
  @ApiResponse({ status: 200, description: 'Top areas', type: [Object] })
  async getTopAreas() {
    return this.dashboardService.getTopAreas();
  }

  @Get('top-agents')
  @ApiOperation({ summary: 'Get top 5 sales agents' })
  @ApiResponse({ status: 200, description: 'Top sales agents', type: [Object] })
  async getTopSalesAgents() {
    return this.dashboardService.getTopSalesAgents();
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get recent activities' })
  @ApiResponse({
    status: 200,
    description: 'Recent activity data',
    type: [Object],
  })
  async getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }
}
