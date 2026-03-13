import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Project } from 'src/projects/schema/project.schema';
import { Unit, UnitDocument } from './schema/unit.schema';
import { UploadService } from 'src/common/storage/upload.service';
import { UnitStatus } from './enums/unit-status.enum';
import { ApiFeatures } from 'src/common/utils/api-features';
import { buildQueryDto } from 'src/common/dto/base-query.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Unit.name) private readonly unitModel: Model<Unit>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectConnection() private readonly connection: Connection,
    private readonly uploadService: UploadService,
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
      if (!files?.length) {
          throw new BadRequestException(' image is required');
      }

    // 1 Upload images
    const images = await this.uploadService.upload(files)
      
    const unit = await this.unitModel.create({
      ...createUnitDto,
        area: new Types.ObjectId(createUnitDto.area),
       project: new Types.ObjectId(createUnitDto.project),
      images,
    });

    return unit;
  }

  async sellUnit(unitId: string): Promise<UnitDocument> {
    const unit = await this.unitModel.findById(unitId);

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (unit.status === UnitStatus.SOLD) {
      throw new ConflictException('Unit is not available for sale');
    }
    // Mark unit as sold
    unit.status = UnitStatus.SOLD;
    await unit.save();

    return unit;
  }

  // @desc-> find all
  async findAll(query: buildQueryDto) {
    const features = new ApiFeatures(
      this.unitModel.find().populate('project', 'name -_id'),
      query,
    )
      .filter()
      .search(['unitCode', 'type']);

    const total = await features.count();

    features.sort().limitFields().paginate(total);

    const data = await features.exec();

    return {
      results: data.length,
      pagination: features.paginationResult,
      data: data,
    };
  }

  // @desc-> find one by id
  async findOne(id: string): Promise<UnitDocument> {
    const unit = await this.unitModel
      .findById(id)
      .populate('project', 'name -_id');
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }
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
    return 'Unit deleted successfully';
  }
}
