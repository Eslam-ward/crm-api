import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Developer } from './schema/developer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApiFeatures } from 'src/common/utils/api-features';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { Project, ProjectDocument } from 'src/projects/schema/project.schema';
import { UnitDocument } from 'src/units/schema/unit.schema';
import { UnitStatus } from 'src/units/enums/unit-status.enum';

@Injectable()
export class DevelopersService {
  constructor(  
    @InjectModel(Developer.name)
      private readonly developerModel: Model<Developer>,

    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel('Unit')
    private unitModel: Model<UnitDocument>,
      
     
    ) {}

  async create(createDeveloperDto: CreateDeveloperDto) {
    const existingDeveloper = await this.developerModel.findOne({
      email: createDeveloperDto.email,
    });

    if (existingDeveloper) {
      throw new ConflictException('Developer with this email already exists');
    }

    return this.developerModel.create(createDeveloperDto);
  }
//  @desc fined all developers
async findAll(query: buildQueryDto) {
  const features = new ApiFeatures(
    this.developerModel.find(),
    query,
  )
    .filter()
    .search(['email', 'name']);

  const total = await features.count();

  features.sort().limitFields().paginate(total);

  const data = await features.exec();

  return {
    results: data.length,
    pagination: features.paginationResult,
    data: data
  };
}


// @desc get all project that belong to specific developer

async getDeveloperProjects(developerId: string, query: buildQueryDto) {
  const features = new ApiFeatures(
    this.projectModel.find({ developer: developerId }),
    query,
  )
    .filter()
    .search(['name', 'description', 'location'])
    .sort()
    .limitFields();

  const total = await features.count();
  features.paginate(total);

  return {
    results: total,
    pagination: features.paginationResult,
    data: await features.exec(),
  };
}


  async findOne(id: string) {
    const developer = await this.developerModel.findById({_id: id,});
    if (!developer) {
      throw new BadRequestException('Developer not found');
    }
    return developer;
  }

  async update(id: string, updateDeveloperDto: UpdateDeveloperDto) {
     const developer = await this.developerModel.findById({_id: id,});
    if (!developer) {
      throw new BadRequestException('Developer not found');

    }
  if (updateDeveloperDto.email) {
  const emailExists = await this.developerModel.findOne({
    email: updateDeveloperDto.email,
    _id: { $ne: id },
  });

  if (emailExists) {
    throw new ConflictException('Developer with this email already exists');
  }
}
    return this.developerModel.findByIdAndUpdate(id, updateDeveloperDto, { new: true });

  }

  async remove(id: string): Promise<string> {
    const developer = await this.developerModel.findById(id);
    if (!developer) throw new NotFoundException('Developer not found');
    // Delete all projects associated with this developer
   const projects = await this.projectModel.find({ developer: id });
    await Promise.all(projects.map((p) => p.deleteOne()));
    await developer.deleteOne();
    return 'Developer and all associated projects deleted successfully';
  }

  
  async getDeveloperDashboardSummary() {
  const [developers, projects, units] = await Promise.all([
    this.developerModel.countDocuments(),
    this.projectModel.countDocuments(),
    this.unitModel.countDocuments(),
  ]);

  return {
    totalDevelopers: developers,
    totalProjects: projects,
    totalUnits: units,
  };
}





async getoneDeveloperDashboardSummary(developerId: string) {
  const projectIds = await this.projectModel
    .find({ developer: developerId })
    .distinct('_id')
    .lean();

  const projectIdStrings = projectIds.map((id) => id.toString());

  const [totalProjects, unitStats, activeAreas] = await Promise.all([
    this.projectModel.countDocuments({ developer: developerId }),

    this.unitModel.aggregate([
      {
        $match: {
          project: { $in: projectIdStrings },
        },
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: 1 },
          availableUnits: {
            $sum: { $cond: [{ $eq: ['$status', UnitStatus.AVAILABLE] }, 1, 0] },
          },
          soldUnits: {
            $sum: { $cond: [{ $eq: ['$status', UnitStatus.SOLD] }, 1, 0] },
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$status', UnitStatus.SOLD] }, '$price', 0] },
          },
        },
      },
      { $project: { _id: 0 } },
    ]),

    this.projectModel.distinct('area', { developer: developerId }),
  ]);

  const units = unitStats[0] ?? {
    totalUnits: 0,
    availableUnits: 0,
    soldUnits: 0,
    totalRevenue: 0,
  };

  return {
    totalProjects,
    totalUnits: units.totalUnits,
    availableUnits: units.availableUnits,
    soldUnits: units.soldUnits,
    totalRevenue: units.totalRevenue,
    activeAreas,
  };
}



















}

