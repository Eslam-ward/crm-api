import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schema/lead.schema';

@Injectable()
export class LeadsAnalyticsService {
  constructor(
    @InjectModel(Lead.name)
    private readonly leadModel: Model<LeadDocument>,
  ) {}

  async getStatusSummary() {
    const statusOrder = [
      'NEW',
      'CONTACTED',
      'INTERESTED',
      'NOT_INTERESTED',
      'CONVERTED',
    ];

    const summary = await this.leadModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          orderIndex: {
            $indexOfArray: [statusOrder, '$_id'],
          },
        },
      },
      {
        $sort: { orderIndex: 1 },
      },
    ]);

    return this.formatSummary(summary);
  }

  private formatSummary(summary: any[]) {
    return summary.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
  }
}