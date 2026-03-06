import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Area } from './schema/area.schema';
import { Model } from 'mongoose';

import { AreasAnalyticsService } from './areas-analytics.service';
import { ApiFeatures } from 'src/common/utils/api-features';
import { buildQueryDto } from 'src/common/dto/base-query.dto';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(Area.name)
    private readonly areaModel: Model<Area>,

    private readonly areasAnalyticsService: AreasAnalyticsService,
  ) {}

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    const { name, project } = createAreaDto;

    const exists = await this.areaModel.findOne({
      name: name.trim(),
      project,
    });

    if (exists) {
      throw new BadRequestException('Area already exists inside this project');
    }

    return this.areaModel.create(createAreaDto);
  }

  // ***************************************
  async findAll(query: buildQueryDto) {
    const features = new ApiFeatures(this.areaModel.find(), query)
      .filter()
      .search(['name']);

    const total = await features.count();
    features.sort().paginate(total);

    const areas = await features.exec();
    const areaIds = areas.map((area) => area._id);

    const data = await this.areasAnalyticsService.findByIds(areaIds);

    return {
      results: data.length,
      pagination: features.paginationResult,
      data,
    };
  }

  // @desc find one
  async findOne(id: string): Promise<Area> {
    const area = await this.areaModel.findById(id);
    if (!area) throw new NotFoundException(`Area "${id}" not found`);
    return area;
  }
  // ToDo :update area
  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<Area> {
    const { name, project } = updateAreaDto;

    if (name) {
      const exists = await this.areaModel.findOne({
        _id: { $ne: id },
        name: name.trim(),
        project,
      });

      if (exists) {
        throw new BadRequestException(
          'Area already exists inside this project',
        );
      }
    }

    const area = await this.areaModel.findByIdAndUpdate(id, updateAreaDto, {
      new: true,
      runValidators: true,
    });

    if (!area) {
      throw new NotFoundException(`Area "${id}" not found`);
    }

    return area;
  }

  async remove(id: string): Promise<{ message: string }> {
    const area = await this.areaModel.findByIdAndDelete(id);
    if (!area) throw new NotFoundException(`Area "${id}" not found`);
    return { message: 'area deleted successfully' };
  }
}
