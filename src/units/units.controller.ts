import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

const MAX_FILES = 5;
 @UseGuards(JwtAuthGuard, RolesGuard)
 @Roles('admin')
@ApiTags('Units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @ApiOperation({ summary: 'Create unit' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Unit created successfully' })

  @Post()
  @UseInterceptors(FilesInterceptor('images', MAX_FILES))
  create(
    @Body() dto: CreateUnitDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.unitsService.create(dto, files);
  }

  @ApiOperation({ summary: 'Sell unit' })
  @ApiParam({ name: 'id', description: 'Unit ID' })
  @ApiOkResponse({ description: 'Unit sold successfully' })
  @Patch(':id/sell')
  async sellUnit(@Param('id', ParseObjectIdPipe) id: string) {
    return this.unitsService.sellUnit(id);
  }

  @ApiOperation({ summary: 'Get all units' })
  @ApiOkResponse({ description: 'Return units list' })
  @Get('all')
  findAll(@Query() query: buildQueryDto) {
    return this.unitsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get unit by id' })
  @ApiParam({ name: 'id', description: 'Unit ID' })
  @ApiOkResponse({ description: 'Return unit details' })
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.unitsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update unit' })
  @ApiParam({ name: 'id', description: 'Unit ID' })
  @ApiConsumes('multipart/form-data')

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', MAX_FILES))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUnitDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.unitsService.update(id, dto, files);
  }

  @ApiOperation({ summary: 'Delete unit' })
  @ApiParam({ name: 'id', description: 'Unit ID' })
  @ApiOkResponse({ description: 'Unit deleted successfully' })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.unitsService.remove(id);
  }
}