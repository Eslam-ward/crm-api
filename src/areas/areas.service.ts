import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Area } from './schema/area.schema';
import { Model, Types } from 'mongoose';

import { AreasAnalyticsService } from './areas-analytics.service';
import { ApiFeatures } from 'src/common/utils/api-features';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { AreaRepository } from './repositories/area.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(Area.name)
    private readonly areaModel: Model<Area>,
     private readonly repo: AreaRepository,
      @Inject(CACHE_MANAGER) private cacheManager: any,

    private readonly areasAnalyticsService: AreasAnalyticsService,
  ) {}

  async create(dto: CreateAreaDto){
   await this.ensureUnique(dto.name, dto.project);
    const area = await this.areaModel.create(dto);
    await this.cacheManager.del('areas_all'); 
    return area;
  }

  // ***************************************
  async findAll(query: buildQueryDto) {
    const cached = await this.cacheManager.get('areas_all');
    if (cached) return cached;
    const features = new ApiFeatures(this.repo.findMany({}), query)
      .filter()
      .search(['name',"location"]);

    const total = await features.count();
    features.sort().paginate(total);

    const areas = await features.exec();
    const areaIds = areas.map((area) => area._id);
    

    const data = await this.areasAnalyticsService.findByIds(areaIds);


 
    const result = {
      results: total,
      pagination: features.paginationResult,
      data,
    };

    await this.cacheManager.set('areas_all', result); 
    return result;
  }

  // @desc find one
  async findOne(id: string): Promise<Area> {
      const area = await this.repo.findById(id);

    if (!area) {
      throw new NotFoundException(`Area "${id}" not found`);
    }

    return area;
  }

  // ToDo :update area
async update(id: string, dto: UpdateAreaDto) {
  if (dto.name && dto.project) {
    await this.ensureUnique(dto.name, dto.project, id);
 
  }
  const updated = await this.repo.update(id,dto);

  if (!updated) {
    throw new NotFoundException(`Area "${id}" not found`);
  }
   await this.cacheManager.del('areas_all'); 
    await this.cacheManager.del(`area:${id}`);

  return updated;
}

  async remove(id: string): Promise<{ message: string }> {
      const deleted = await this.repo.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Area "${id}" not found`);
    }
    await this.cacheManager.del('areas_all');
    await this.cacheManager.del(`area:${id}`);

    return { message: 'Area deleted successfully' };
  }




    private async ensureUnique(
    name: string,
    project: string,
    excludeId?: string,
  ) {
    const filter: any = { name: name.trim(), project };

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const exists = await this.repo.findOne(filter);

    if (exists) {
      throw new BadRequestException('Area already exists inside this project');
    }
  }
}


