import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../schema/project.schema';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UploadService } from 'src/common/storage/upload.service';
import { MongooseBuilder } from 'src/common/builders/mongoose.builder';

const PROJECT_IMAGE_CONFIG = {
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

@Injectable()
export class ProjectBuilder extends MongooseBuilder<
  ProjectDocument,
  CreateProjectDto
> {
  constructor(
    @InjectModel(Project.name)
    model: Model<ProjectDocument>,
    private readonly uploadService: UploadService,
  ) {
    super(model);
  }

  async setImages(files: Express.Multer.File[]): Promise<this> {
    if (files?.length) {
      const images = await this.uploadService.upload(
        files,
        PROJECT_IMAGE_CONFIG.allowedTypes,
      );

      this.data.images = images as any;
    }

    return this;
  }

  override setBaseData(dto: CreateProjectDto): this {
    super.setBaseData(dto);

    // Business rule example


    return this;
  }
}