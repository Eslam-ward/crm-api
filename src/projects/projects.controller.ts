import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,

  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

const MAX_FILES = 5;

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', MAX_FILES))
  create(
    @Body() dto: CreateProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
    
  ) {
    return this.projectsService.create(dto, files);
  }

  @Get()
  findAll(@Query() query: buildQueryDto) {
    return this.projectsService.findAll(query);
  }

@Get('stats')
  getStats() {
    return this.projectsService.getDashboardSummary();
  }



  @Get('summary/:id')
  async getSummaryStats(@Param('id') projectId: string) {
    return this.projectsService.getoneProductSummary(projectId);
  }
// 


  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', MAX_FILES))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.projectsService.update(id, dto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.projectsService.remove(id);
  }


}