import { Model, Document } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { ApiFeatures } from '../utils/api-features';

export abstract class BaseCrudService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(dto: any): Promise<T> {
    return this.model.create(dto);
  }

  async findOne(id: string, populate?: any): Promise<T> {
    let query = this.model.findById(id);
    if (populate) query = query.populate(populate);

    const document = await query;
    if (!document)
      throw new NotFoundException(`No document found with id: ${id}`);

    return document;
  }

  async update(id: string, dto: any): Promise<T> {
    const document = await this.model.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!document)
      throw new NotFoundException(`No document found with id: ${id}`);

    return document;
  }

  async delete(id: string): Promise<{ message: string }> {
    const document = await this.model.findByIdAndDelete(id);

    if (!document)
      throw new NotFoundException(`No document found with id: ${id}`);

    return { message: 'Document deleted successfully' };
  }

  async findAll(query: any, searchFields: string[] = []) {
    const total = await this.model.countDocuments();

    const features = new ApiFeatures(
      this.model.find(),
      query,
    )
      .filter()
      .search(searchFields)
      .sort()
      .limitFields()
      .paginate(total);

    const data = await features.exec();

    return {
      results: data.length,
      pagination: features.paginationResult,
      data,
    };
  }
}