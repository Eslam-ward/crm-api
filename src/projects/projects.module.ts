import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schema/project.schema';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UploadService  } from 'src/common/storage/upload.service';
import { ProjectBuilder } from './builders/project.builder';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService,UploadService,ProjectBuilder],
  exports: [ProjectsService], // ← exported so DevelopersModule can use it
})
export class ProjectsModule {}
