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
  ApiBearerAuth,
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
@Roles('admin', 'super_admin', 'sales')
@ApiBearerAuth()
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

  @ApiOperation({ summary: 'Get all units' })
  @ApiOkResponse({ description: 'Return units list' })
  @Roles('admin', 'super_admin', 'sales')
  @Get('all')
  findAll(@Query() query: buildQueryDto) {
    return this.unitsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get unit by id' })
  @ApiParam({ name: 'id', description: 'Unit ID' })
  @ApiOkResponse({ description: 'Return unit details' })
  @Roles('admin','super_admin','sales')
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.unitsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update unit' })
  @ApiParam({ name: 'id', description: 'Unit ID' })
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @Roles('admin','super_admin','sales')
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
  @Roles('admin', 'super_admin')
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.unitsService.remove(id);
  }
}
