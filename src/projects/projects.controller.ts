import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', MAX_FILES))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.projectsService.update(id, dto, files);
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
