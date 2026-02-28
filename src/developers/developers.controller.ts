import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,

} from '@nestjs/swagger';

import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiTags('Developers')
@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @ApiOperation({ summary: 'Create developer' })
  @ApiCreatedResponse({ description: 'Developer created successfully' })
  @Post()
  create(@Body() createDeveloperDto: CreateDeveloperDto) {
    return this.developersService.create(createDeveloperDto);
  }

  @ApiOperation({ summary: 'Get all developers' })
  @ApiOkResponse({ description: 'Return developers list' })
  @Get()
  findAll(@Query() query: buildQueryDto) {
    return this.developersService.findAll(query);
  }

  @ApiOperation({ summary: 'Get developers dashboard summary' })
  @ApiOkResponse({ description: 'Return dashboard summary' })
  @Get('summary')
  async getDashboardSummary() {
    return this.developersService.getDeveloperDashboardSummary();
  }

  @ApiOperation({ summary: 'Get single developer dashboard summary' })
  @ApiParam({ name: 'id', description: 'Developer ID' })
  @ApiOkResponse({ description: 'Return developer summary' })
  @Get(':id/summary')
  async getDeveloperSummary(@Param('id') id: string) {
    return this.developersService.getoneDeveloperDashboardSummary(id);
  }

  @ApiOperation({ summary: 'Get developer by id' })
  @ApiParam({ name: 'id', description: 'Developer ID' })
  @ApiOkResponse({ description: 'Return developer data' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.developersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update developer' })
  @ApiParam({ name: 'id', description: 'Developer ID' })
  @ApiOkResponse({ description: 'Developer updated successfully' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeveloperDto: UpdateDeveloperDto,
  ) {
    return this.developersService.update(id, updateDeveloperDto);
  }

  @ApiOperation({ summary: 'Delete developer' })
  @ApiParam({ name: 'id', description: 'Developer ID' })
  @ApiOkResponse({ description: 'Developer deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.developersService.remove(id);
  }
}