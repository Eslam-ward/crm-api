import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/roles.enum';
@ApiTags('Areas')
@ApiBearerAuth()

@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN,UserRole.SALES)
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @ApiOperation({ summary: 'Create new area' })
  @ApiResponse({ status: 201, description: 'Area created successfully' })
  @ApiResponse({ status: 400, description: 'Area already exists' })
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all areas with filtering and pagination' })
  findAll(@Query() query: buildQueryDto) {
    return this.areasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get area by id' })
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.areasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update area' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateAreaDto: UpdateAreaDto,
  ) {
    return this.areasService.update(id, updateAreaDto);
  }
   @ApiOperation({ summary: 'Delete area' })
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.areasService.remove(id);
  }
}