import { Document, Query } from 'mongoose';

export interface PaginationResult {
  currentPage: number;
  limit: number;
  numberOfPages: number;
}

export class ApiFeatures<T extends Document> {
  private mongooseQuery: Query<T[], T>;
  private queryString: Record<string, any>;
  public paginationResult?: PaginationResult;

  constructor(
    mongooseQuery: Query<T[], T>,
    queryString: Record<string, any>,
  ) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v ');
    }
    return this;
  }

  search(searchFields: string[] = []): this {
    if (this.queryString.keyword && searchFields.length) {
      const keyword = this.queryString.keyword;
      const query = {
        $or: searchFields.map((field) => ({
          [field]: { $regex: keyword, $options: 'i' },
        })),
      };

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }

  paginate(totalDocuments: number): this {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 50;
    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(totalDocuments / limit),
    };

    return this;
  }

  async exec(): Promise<T[]> {
    return this.mongooseQuery.exec();
  }
}