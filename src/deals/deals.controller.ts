import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { UpdateDealStatusDto } from './dto/update-deal-status.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Deals')
@ApiBearerAuth()
@Controller('deals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'admin', 'sales')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new deal' })
  create(@Body() createDealDto: CreateDealDto) {
    return this.dealsService.create(createDealDto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Get all deals' })
  findAll(@Query() query: buildQueryDto) {
    return this.dealsService.findAll(query);
  }

  @Get('pipeline/summary')
  @ApiOperation({ summary: 'Get pipeline summary analytics' })
  getPipelineSummary() {
    return this.dealsService.getPipelineSummary();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal by id' })
  findOne(@Param('id') id: string) {
    return this.dealsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update deal' })
  update(
    @Param('id') id: string,
    @Body() updateDealDto: UpdateDealDto,
  ) {
    return this.dealsService.update(id, updateDealDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update deal status' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDealStatusDto: UpdateDealStatusDto,
  ) {
    return this.dealsService.updateStatus(id, updateDealStatusDto);
  }

 @Roles('super_admin', 'admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete deal' })
  remove(@Param('id') id: string) {
    return this.dealsService.remove(id);
  }
}