import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Types } from 'mongoose';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionType } from '../enums/transaction-type.enum';
import { ITreasuryStats } from '../interfaces/treasury-state.interfaces';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ApiFeatures } from 'src/common/utils/api-features';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  async create(
    data: Partial<Transaction>,
    session: ClientSession,
  ): Promise<Transaction> {
    const [created] = await this.transactionModel.create([data], { session });
    return created;
  }

  async findAll(query: buildQueryDto) {
    const features = new ApiFeatures(
      this.transactionModel
        .find()
        .populate('linkedDeal', 'title -_id')
        .populate('salesAgent', 'fullName -_id')
        .populate('createdBy', 'fullName role -_id'),
      query,
    )
      .filter()
      .search(['category', 'source', 'salesAgent', 'salesAgent', 'linkedDeal']);

    const total = await features.count();

    features.sort().limitFields().paginate(total);

    const data = await features.exec();

    return {
      results: data.length,
      pagination: features.paginationResult,
      data: data,
    };
  }

  async getStats(): Promise<ITreasuryStats> {
    const [result] = await this.transactionModel.aggregate<ITreasuryStats>([
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', TransactionType.INCOME] }, '$amount', 0],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [
                { $eq: ['$type', TransactionType.EXPENSE] },
                '$amount',
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpenses: 1,
          netBalance: { $subtract: ['$totalIncome', '$totalExpenses'] },
        },
      },
    ]);

    return result ?? { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
  }

  async update(
    transactionId: string,
    data: Partial<Transaction>,
    session?: ClientSession,
  ): Promise<Transaction> {
    const updated = await this.transactionModel.findByIdAndUpdate(
      new Types.ObjectId(transactionId),
      { $set: data },
      { new: true, session },
    );

    if (!updated) throw new NotFoundException('Transaction not found');

    return updated;
  }

  async delete(
    transactionId: string,
    session?: ClientSession,
  ): Promise<{ deleted: boolean }> {
    const result = await this.transactionModel.findByIdAndDelete(
      new Types.ObjectId(transactionId),
      { session },
    );

    if (!result) throw new NotFoundException('Transaction not found');

    return { deleted: true };
  }

  async findById(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findById(new Types.ObjectId(transactionId))
      .populate('linkedDeal', 'title -_id')
      .populate('salesAgent', 'fullName -_id')
      .populate('createdBy', 'fullName role -_id')
      .lean();

    if (!transaction) throw new NotFoundException('Transaction not found');

    return transaction;
  }

  async findDuplicate(dto: any, session?: ClientSession) {
    return this.transactionModel
      .findOne(
        {
          type: dto.type,
          amount: dto.amount,
          category: dto.category,
          source: dto.source,
          date: dto.date,
        },
        null,
        { session },
      )
      .lean();
  }

  async findForExport(query: buildQueryDto) {
    return new ApiFeatures(
      this.transactionModel
        .find()
        .populate('linkedDeal', 'title -_id')
        .populate('salesAgent', 'fullName -_id')
        .populate('createdBy', 'fullName role -_id'),
      query,
    )
      .filter()
      .search(['type', 'source', 'salesAgent', 'category'])
      .sort()
      .limitFields()
      .exec();
  }
}
