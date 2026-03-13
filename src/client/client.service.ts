import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from './schema/client.schema';
import { Deal, DealDocument } from '../deals/schema/deal.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ApiFeatures } from 'src/common/utils/api-features';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,

    @InjectModel(Deal.name)
    private readonly dealModel: Model<DealDocument>,
  ) {}

  async create(createDto: CreateClientDto): Promise<Client> {
    // make sure email is unique
    const existing = await this.clientModel.findOne({ email: createDto.email });
    if (existing) {
      throw new ConflictException('Client with this email already exists');
    }
    return this.clientModel.create(createDto);
  }

  async findAll(query:buildQueryDto) {
      const features = new ApiFeatures(
         this.clientModel.find().lean(),
         query,
       )
         .filter()
         .search(['email', 'fullName','phone']);
   
       const total = await features.count();
   
       features.sort().limitFields().paginate(total);
   
       const data = await features.exec();
   
       return {
         results: data.length,
         pagination: features.paginationResult,
         data: data,
       };
  }

  async findOne(id: string) {
    return this.clientModel.findById(id).lean();
  }

  // @desc update client details
  // @route PATCH /api/clients/:id
  // @access Private
  async update(id: string, updateDto:UpdateClientDto): Promise<Client> {

    // if email is being updated, check for uniqueness
    if (updateDto.email) {
      const existing = await this.clientModel.findOne({ email: updateDto.email, _id: { $ne: id } });
      if (existing) {
        throw new ConflictException('Another client with this email already exists');
      }
    }
    const client = await this.clientModel.findByIdAndUpdate(id, updateDto, { new: true });
    if (!client) {
      throw new NotFoundException('Client not found');
    } 
    return client;
  }

  

 async remove(id: string):Promise<{ message: string }> {
  const client = await this.clientModel.findByIdAndDelete(id);
  if (!client) {
    throw new NotFoundException('Client not found');
  }

  return { message: 'Client deleted successfully' };
}

  //  Dashboard Analytics
  async getDashboardStats() {
    const totalClients = await this.clientModel.countDocuments();

    const dealsAgg = await this.dealModel.aggregate([
      {
        $group: {
          _id: null,
          totalDeals: { $sum: 1 },
          totalRevenue: { $sum: '$value' },
        },
      },
    ]);

    return {
      totalClients,
      totalDeals: dealsAgg[0]?.totalDeals || 0,
      totalRevenue: dealsAgg[0]?.totalRevenue || 0,
    };
  }



async getClientAnalytics(clientId: string) {
  const result = await this.dealModel.aggregate([
    {
      $match: {
        client: new Types.ObjectId(clientId),
        status: 'CLOSED_WON',
      },
    },
    {
      $lookup: {
        from: 'units',
        localField: 'unit',
        foreignField: '_id',
        as: 'unit',
      },
    },
    { $unwind: '$unit' },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$client',
        totalDeals: { $sum: 1 },
        totalSpent: { $sum: '$value' },
        properties: {
          $addToSet: {
            unitId: '$unit._id',
            unitCode: '$unit.unitCode',
          },
        },
        lastDeals: { 
          $push: {
            unitName: '$unit.unitCode',
            dealDate: '$createdAt',
            status: '$status',
            value: '$value',
          },
        },
      },
    },
    {
      $addFields: {
        lastDeals: {
          $map: {
            input: { $slice: ['$lastDeals', 3] }, 
            as: 'deal',
            in: {
              unitName: '$$deal.unitName',
              dealDate: { $dateToString: { format: "%Y-%m-%d", date: "$$deal.dealDate" } },
              status: '$$deal.status',
              value: '$$deal.value',
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalDeals: 1,
        totalSpent: 1,
        totalProperties: { $size: '$properties' },
        properties: 1,
        lastDeals: 1,
      },
    },
  ]);

  if (!result.length) {
    return {
      totalDeals: 0,
      totalSpent: 0,
      totalProperties: 0,
      properties: [],
      lastDeals: [],
    };
  }

  return result[0];
}
}