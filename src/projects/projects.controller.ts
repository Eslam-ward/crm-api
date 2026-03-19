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

import { FilesInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

const MAX_FILES = 5;

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
 @UseGuards(JwtAuthGuard, RolesGuard)
 @Roles('admin','super_admin','sales')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Create project' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Project created successfully' })

  @Post()
  @UseInterceptors(FilesInterceptor('images', MAX_FILES))
  create(
    @Body() dto: CreateProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.projectsService.create(dto, files);
  }

  @ApiOperation({ summary: 'Get all projects' })
  @ApiOkResponse({ description: 'Return projects list' })
  @Get()
  findAll(@Query() query: buildQueryDto) {
    return this.projectsService.findAll(query);
  }
  

  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiOkResponse({ description: 'Return dashboard stats' })
  @Get('stats')
  getStats() {
    return this.projectsService.getDashboardSummary();
  }
  @ApiOperation({ summary: 'Get all units that belong to specific project' })
  @ApiOkResponse({ description: 'Return all units' })
  @Get(':projectId/units')
  getProjectUnits(
  @Param('projectId') projectId: string,
  @Query() query: buildQueryDto,
) {
  return this.projectsService.getProjectUnits(projectId, query);
}
  @ApiOperation({ summary: 'Get project summary stats' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOkResponse({ description: 'Return project summary stats' })
  @Get('summary/:id')
  async getSummaryStats(@Param('id') projectId: string) {
    return this.projectsService.getoneProductSummary(projectId);
  }

  @ApiOperation({ summary: 'Get project by id' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOkResponse({ description: 'Return project details' })
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiConsumes('multipart/form-data')

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', MAX_FILES))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.projectsService.update(id, dto, files);
   
  }


  @ApiOperation({ summary: 'Delete project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOkResponse({ description: 'Project deleted successfully' })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
