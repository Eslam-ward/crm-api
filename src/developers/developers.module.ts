import { Module } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { DevelopersController } from './developers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Developer, DeveloperSchema } from './schema/developer.schema';
import { Project, ProjectSchema } from 'src/projects/schema/project.schema';

@Module({
    imports: [
          MongooseModule.forFeature([
        { name: Developer.name, schema: DeveloperSchema },
        { name: Project.name, schema: ProjectSchema },
      ]),
    ],
  controllers: [DevelopersController],
  providers: [DevelopersService],
  exports: [DevelopersService],
})
export class DevelopersModule {}
