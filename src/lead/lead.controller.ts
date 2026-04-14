import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,

  Query,
} from '@nestjs/common';

import { LeadsService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { UpdateLeadStatusDto } from './dto/update-LeadStatus.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { UserRole } from 'src/users/enums/roles.enum';

@ApiTags('Leads')
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SALES)
@Controller('leads')
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



  
  @ApiOperation({ summary: 'Delete lead' })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id',ParseObjectIdPipe) id: string) {
    return this.leadsService.remove(id);
  }
}