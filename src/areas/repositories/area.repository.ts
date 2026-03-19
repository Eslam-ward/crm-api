import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from '../schema/area.schema';
import { IAreaRepository } from '../interfaces/area.repository.interface';

@Injectable()
export class AreaRepository implements IAreaRepository {
  constructor(
    @InjectModel(Area.name)
    private readonly model: Model<Area>,
  ) {}

  async create(data: Partial<Area>): Promise<Area> {
    return this.model.create(data);
  }

  async findOne(filter:any): Promise<Area | null> {
    return this.model.findOne(filter).lean();
  }

  async findById(id: string): Promise<Area | null> {
    return this.model.findById(id).populate('project', 'name -_id').lean();
  }

 findMany(query: any) {
    return this.model.find(query).populate('project', 'name -_id').lean();
  }

  async update(id: string, data: any): Promise<Area | null> {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async delete(id: string): Promise<Area | null> {
    return this.model.findByIdAndDelete(id);
  }
}