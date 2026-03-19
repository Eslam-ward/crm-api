import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Model, Types } from 'mongoose';
import {  InjectModel } from '@nestjs/mongoose';
import { Unit, UnitDocument } from './schema/unit.schema';
import { UploadService } from 'src/common/storage/upload.service';
import { UnitStatus } from './enums/unit-status.enum';
import { ApiFeatures } from 'src/common/utils/api-features';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Unit.name) private readonly unitModel: Model<Unit>,
    private readonly uploadService: UploadService,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  async create(
    createUnitDto: CreateUnitDto,
    files: Express.Multer.File[],
  ): Promise<Unit> {
    const existingUnit = await this.unitModel.findOne({
      unitCode: createUnitDto.unitCode,
    });
    if (existingUnit) {
      throw new ConflictException(`Unit with this code already exists`);
    }


    // 1 Upload images
    const images = await this.uploadService.upload(files)
      
    const unit = await this.unitModel.create({
      ...createUnitDto,
        area: new Types.ObjectId(createUnitDto.area),
       project: new Types.ObjectId(createUnitDto.project),
      images,
    });
    // @apply caching 
    await this.cacheManager.del('units_all');

    return unit;
  }


  // @desc-> find all
  async findAll(query: buildQueryDto) {

     const cached = await this.cacheManager.get('units_all');
    if (cached) return cached;
    const features = new ApiFeatures(
      this.unitModel.find().populate('project', 'name -_id').populate('area', 'name  location -_id').lean(),
      query,
    )
      .filter()
      .search(['unitCode', 'type']);

    const total = await features.count();

    features.sort().limitFields().paginate(total);

    const data = await features.exec();

     const response = {
      results: data.length,
      pagination: features.paginationResult,
      data: data,
    };

    await this.cacheManager.set('units_all', response); 
    return response;
  }

  // @desc-> find one by id
  async findOne(id: string): Promise<Unit> {
     const cached = await this.cacheManager.get(`unit:${id}`);
    if (cached) return cached as UnitDocument;

    const unit = await this.unitModel
      .findById(id)
      .populate('project', 'name -_id').populate('area', 'name  location -_id').lean();
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }
     await this.cacheManager.set(`unit:${id}`, unit);
    return unit;
  }

  // @desc-> update unit
  async update(
    id: string,
    updateUnitDto: UpdateUnitDto,
    files?: Express.Multer.File[],
  ): Promise<UnitDocument> {
    const unit = await this.unitModel.findById(id);

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (files?.length) {
      unit.images = await this.uploadService.replace(unit.images, files);
    }

    const oldStatus = unit.status;
    const newStatus = updateUnitDto.status;

    let incUpdate: Record<string, number> = {};

    if (newStatus && newStatus !== oldStatus) {
      incUpdate[`${oldStatus}Units`] = -1;

      incUpdate[`${newStatus}Units`] = 1;
    }

    Object.assign(unit, updateUnitDto);
    await unit.save();
    await this.cacheManager.del('units_all');
    await this.cacheManager.del(`unit:${id}`);

    return unit;
  }
  // @desc-> delete unit
  async remove(id: string): Promise<string> {
    const unit = await this.unitModel.findById(id);
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    await this.uploadService.deleteImages(unit.images);
    await unit.deleteOne();
    await this.cacheManager.del('units_all');
    await this.cacheManager.del(`unit:${id}`);
    return 'Unit deleted successfully';
  }
}
