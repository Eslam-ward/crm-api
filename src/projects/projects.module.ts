import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schema/project.schema';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UploadService  } from 'src/common/storage/upload.service';
import { Developer, DeveloperSchema } from 'src/developers/schema/developer.schema';
import { Unit, UnitSchema } from 'src/units/schema/unit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
        { name: Developer.name, schema: DeveloperSchema },
        { name: Unit.name, schema: UnitSchema },

    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, UploadService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
