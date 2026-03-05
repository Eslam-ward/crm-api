import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import { LeadsService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { UpdateLeadStatusDto } from './dto/update-LeadStatus.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@ApiTags('Leads')
@ApiBearerAuth()
@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'admin', 'sales')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}



  @Post()
  @ApiOperation({ summary: 'Create new lead' })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }


  @Get()
  @ApiOperation({ summary: 'Get all leads' })
  findAll(@Query() query: buildQueryDto) {
    return this.leadsService.findAll(query);
  }

  // dashboard sammery
  @Get('sammery')
  @ApiOperation({ summary: 'Get dashboard sammery ' })
  dashboardSummery(){
    return this.leadsService.dashboardSummery()
  }



  @Get(':id')
  @ApiOperation({ summary: 'Get lead by id' })
  findOne(@Param('id',ParseObjectIdPipe) id: string) {
    return this.leadsService.findOne(id);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Update lead' })
  update(
    @Param('id',ParseObjectIdPipe) id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(id, updateLeadDto);
  }



  @Patch(':id/status')
  @ApiOperation({ summary: 'Update lead status' })
  updateStatus(
    @Param('id',ParseObjectIdPipe) id: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(id, dto);
  }



  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead' })
  remove(@Param('id',ParseObjectIdPipe) id: string) {
    return this.leadsService.remove(id);
  }
}