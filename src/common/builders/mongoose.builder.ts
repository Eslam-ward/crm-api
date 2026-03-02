import { Model, Document } from 'mongoose';

import { IBaseBuilder } from './base.builder.interface';
export abstract class MongooseBuilder<
  TDocument extends Document,
  TCreateDto,
> implements IBaseBuilder<TDocument, TCreateDto>
{
  protected data: Partial<TDocument>;

  constructor(protected readonly model: Model<TDocument>) {}

  setBaseData(dto: TCreateDto): this {
    this.data = { ...(dto as any) };
    return this;
  }

  async build(): Promise<TDocument> {
    return this.model.create(this.data);
  }
}