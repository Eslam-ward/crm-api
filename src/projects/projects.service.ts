import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schema/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UploadService  } from 'src/common/storage/upload.service';
import { ApiFeatures } from 'src/common/utils/api-features';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { UnitDocument } from 'src/units/schema/unit.schema';


@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  
  @InjectModel('Unit')
  private unitModel: Model<UnitDocument>,

  private readonly imageService: UploadService,
  ) {}

async create(
  dto: CreateProjectDto,
  files: Express.Multer.File[],
): Promise<Project> {

 
  const images = files?.length
    ? await this.imageService.upload(files,['image/jpeg', 'image/png', 'image/webp'],)
    : [];

 
  const project = await this.projectModel.create({
    ...dto,
    images,
  });


  return project.toObject();
}
  

async findAll(query: buildQueryDto) {

  const features = new ApiFeatures(
    this.projectModel.find().populate('developer', 'name ').lean(),
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

     if (files?.length) {
      project.images = await this.imageService.replace(
        project.images,
        files,
      );
    }

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


// }






async getDashboardSummary() {
  const [projectStats, unitStats] = await Promise.all([
    // Total Projects
    this.projectModel.countDocuments(),

    // Unit breakdown
    this.unitModel.aggregate([
      {
        $group: {
          _id: null,
          totalUnits: { $sum: 1 },
          availableUnits: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] },
          },
          soldUnits: {
            $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] },
          },
        },
      },
      { $project: { _id: 0 } },
    ]),
  ]);

  const units = unitStats[0] ?? {
    totalUnits: 0,
    availableUnits: 0,
    soldUnits: 0,
  };

  return {
    totalProjects: projectStats,
    totalUnits: units.totalUnits,
    availableUnits: units.availableUnits,
    soldUnits: units.soldUnits,
  };
}





async getoneProductSummary(projectId: string) {


  const [units, availableUnits, soldUnits] = await Promise.all([
    this.unitModel.countDocuments({ project: projectId}),
    this.unitModel.countDocuments({ status: 'available', project:projectId }),
    this.unitModel.countDocuments({ status: 'sold', project: projectId}),
  ]);

  return {
    totalUnits: units,
    availableUnits,
    soldUnits,
  };
}





}