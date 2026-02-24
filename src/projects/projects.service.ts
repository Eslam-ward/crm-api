import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schema/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UploadService  } from 'src/common/storage/upload.service';
import { ApiFeatures } from 'src/common/utils/api-features';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ProjectBuilder } from './builders/project.builder';


@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    private readonly imageService: UploadService,
    private readonly projectBuilder: ProjectBuilder,
  ) {}

  async create(dto: CreateProjectDto, files: Express.Multer.File[]): Promise<Project> {
    const project = await this.projectBuilder
      .setBaseData(dto)
      .setImages(files)
      .then((builder) => builder.build());

    return project.toObject();
  }

async findAll(query: buildQueryDto) {

  const features = new ApiFeatures(
    this.projectModel.find().populate('developer', 'name -_id'),
    query,
  )
    .filter()
    .search(['description', 'name']);

  const total = await features.count();

  features.sort().limitFields().paginate(total);

  const data = await features.exec();

  return {
    results: data.length,
    pagination: features.paginationResult,
    data: data
  };
}

  async findOne(id: string) {
    const project = await this.projectModel
      .findById(id)
      .populate('developer', 'name -_id')
      .lean();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    files?: Express.Multer.File[],
  ) {
    const project = await this.projectModel.findById(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.images = await this.imageService.replace(
      project.images,
      files,
    );

    Object.assign(project, dto);
    await project.save();

    return project.toObject();
  }

  async remove(id: string) {
    const project = await this.projectModel.findById(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.imageService.deleteImages(project.images);
    await project.deleteOne();
  }
}