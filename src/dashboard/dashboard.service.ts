import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Unit, UnitDocument } from '../units/schema/unit.schema';
import { Deal, DealDocument } from '../deals/schema/deal.schema';
import { UnitStatus } from '../units/enums/unit-status.enum';
import { Lead, LeadDocument } from 'src/lead/schema/lead.schema';
import { IMonthData } from './interfaces/month-data.interface';
import { DealStatus } from 'src/deals/enums/deal-status.enums';


@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
  ) {}


 
  async getStats() {
    const [
      totalProperties,
      availableUnits,
      soldUnits,
      activeDeals,
      totalLeads,
      revenueResult,
    ] = await Promise.all([
      this.unitModel.estimatedDocumentCount(),

      this.unitModel.countDocuments({ status: UnitStatus.AVAILABLE }),
      this.unitModel.countDocuments({ status: UnitStatus.SOLD }),

      this.dealModel.countDocuments({
        status: { $in: [DealStatus.NEW, DealStatus.NEGOTIATION, DealStatus.RESERVATION] },
      }),

      this.leadModel.estimatedDocumentCount(),

      this.dealModel.aggregate([
        { $match: { status: DealStatus.CLOSED_WON } },
        { $group: { _id: null, total: { $sum: '$value' } } },
      ]),
    ]);

    return {
      totalProperties,
      availableUnits,
      soldUnits,
      activeDeals,
      totalLeads,
      totalRevenue: revenueResult[0]?.total || 0,
    };
  }

  async getSalesOverview() {
    let deals =await this.dealModel.countDocuments()
    console.log(`deals :${deals}`)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const rawData: {
      _id: { year: number; month: number };
      totalRevenue: number;
      totalDeals: number;
    }[] = await this.dealModel.aggregate([
      { $match: { status: DealStatus.CLOSED_WON, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          totalRevenue: { $sum: '$value' },
          totalDeals: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthsMap = new Map<string, IMonthData>();

    rawData.forEach((item) => {
      const date = new Date(item._id.year, item._id.month - 1);
      const month = date.toLocaleString('en-US', { month: 'short' });
      monthsMap.set(month, {
        month,
        totalRevenue: item.totalRevenue,
        totalDeals: item.totalDeals,
      });
    });

    const result: IMonthData[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString('en-US', { month: 'short' });
      result.push(monthsMap.get(month) || { month, totalRevenue: 0, totalDeals: 0 });
    }

    return result;
  }




async getTopAreas() {
  return this.unitModel.aggregate([
    {
      $match: {
        status: "sold", 
      },
    },
    {
      $lookup: {
        from: "areas",
        localField: "area",
        foreignField: "_id",
        as: "areaData",
      },
    },
    { $unwind: "$areaData" },
    {
      $group: {
        _id: "$areaData.location", 
        unitsSold: { $sum: 1 },   
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        areaLocation: "$_id",
        unitsSold: 1,
      },
    },
  ]);
}



async getTopSalesAgents() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const data = await this.dealModel.aggregate([
    {
      $match: {
        status: 'CLOSED_WON',
        createdAt: { $gte: startOfMonth },
      },
    },

    {
      $addFields: {
        salesAgentObjId: { $toObjectId: '$salesAgent' },
      },
    },

    {
      $group: {
        _id: '$salesAgentObjId',
        totalDeals: { $sum: 1 },
        totalRevenue: { $sum: '$value' },
      },
    },

    { $sort: { totalDeals: -1 } },

    { $limit: 5 },

    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'agent',
      },
    },

    {
      $unwind: { path: '$agent', preserveNullAndEmptyArrays: true },
    },

    {
      $project: {
        _id: 0,
        agentName: { $ifNull: ['$agent.fullName', 'Unknown'] },
        totalDeals: 1,
        totalRevenue: 1,
      },
    },
  ]);

  return data;
}

 

  async getRecentActivity() {
  const limit = 5;

  // جلب البيانات الأخيرة
  const [deals, leads, units] = await Promise.all([
    this.dealModel
      .find({}, 'status unit salesAgent createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('salesAgent', 'fullName')
      .populate('unit', 'unitCode')
      .lean(),

    this.leadModel
      .find({}, 'fullName assignedTo createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('assignedTo', 'fullName')
      .lean(),

    this.unitModel
      .find({}, 'unitCode createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
  ]);

  // تحويل كل نوع إلى activity واحد
  const activities = [
    ...deals.map((deal: any) => ({
      type: 'deal',
      message: `Deal ${deal.status === 'CLOSED_WON' ? 'closed' : 'updated'} for ${deal.unit?.unitCode || ''}`,
      by: deal.salesAgent?.fullName || 'System',
      createdAt: deal.createdAt,
    })),

    ...leads.map((lead: any) => ({
      type: 'lead',
      message: `New lead: ${lead.fullName}`,
      by: lead.assignedTo?.fullName || 'System',
      createdAt: lead.createdAt,
    })),

    ...units.map((unit: any) => ({
      type: 'unit',
      message: `Property added: ${unit.unitCode}`,
      by: 'System',
      createdAt: unit.createdAt,
    })),
  ];

  // ترتيب حسب التاريخ والحد الأقصى
  return activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

  async getDashboard() {
    const [stats, salesOverview, topAreas, topSalesAgents, recentActivity] =
      await Promise.all([
        this.getStats(),
        this.getSalesOverview(),
        this.getTopAreas(),
        this.getTopSalesAgents(),
        this.getRecentActivity(),
      ]);

    return {
      stats,
      salesOverview,
      topAreas,
      topSalesAgents,
      recentActivity,
    };
  }
}