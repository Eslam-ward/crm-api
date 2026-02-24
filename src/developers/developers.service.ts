import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Developer } from './schema/developer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiFeatures } from 'src/common/utils/api-features';


@Injectable()
export class DevelopersService {
  constructor(  
    @InjectModel(Developer.name)
      private readonly developerModel: Model<Developer>,

    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
      
     
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
async findAll(query:BuildQueryDto) {
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
}

