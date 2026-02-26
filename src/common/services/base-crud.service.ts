import { NotFoundException } from '@nestjs/common';
import { Model, Document, UpdateQuery } from 'mongoose';
import { ApiFeatures } from '../utils/api-features';
import { BuildQueryDto } from '../dto/base-query.dto';

export class BaseCrudService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findOne(id: string): Promise<T> {
    const document = await this.model.findById(id);

    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return document;
  }

  async findAll(query: BuildQueryDto) {
    const features = new ApiFeatures(this.model.find(), query)
      .filter()
      .search();

    const total = await features.count();

    features.sort().limitFields().paginate(total);

    const data = await features.exec();

    return {
      results: data.length,
      pagination: features.paginationResult,
      data,
    };
  }

  async update(id: string, dto: UpdateQuery<T>): Promise<T> {
    const updated = await this.model.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.model.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
  }
}