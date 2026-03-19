import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Areas')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('admin', 'super_admin')
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete area' })
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.areasService.remove(id);
  }
}