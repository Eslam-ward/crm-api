import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
const MAX_FILES = 5;

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', MAX_FILES))
  create(
    @Body() dto: CreateUnitDto,
    @UploadedFiles() files: Express.Multer.File[],
    
  ) {
    return this.unitsService.create(dto, files);
  }


@Patch(':id/sell')
async sellUnit(@Param('id', ParseObjectIdPipe) id: string) {
  return this.unitsService.sellUnit(id);
}

  @Get('all')
  findAll(@Query() query: buildQueryDto) {
    return this.unitsService.findAll(query);


  }
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.unitsService.findOne(id);
  }

    @Patch(':id')
    @UseInterceptors(FilesInterceptor('images', MAX_FILES))
    update(
      @Param('id', ParseObjectIdPipe) id: string,
      @Body() dto: UpdateUnitDto,
      @UploadedFiles() files?: Express.Multer.File[],
    ) {
      return this.unitsService.update(id, dto, files);
    }
    




}
