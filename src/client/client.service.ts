import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from './schema/client.schema';
import { Deal, DealDocument } from '../deals/schema/deal.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ApiFeatures } from 'src/common/utils/api-features';

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
         this.dealModel.find().lean(),
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
  

 async remove(id: string):Promise<{ message: string }> {
  const client = await this.clientModel.findByIdAndDelete(id);
  if (!client) {
    throw new NotFoundException('Client not found');
  }

  return { message: 'Client deleted successfully' };
}

  // 🔥 Dashboard Analytics
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

  // 🔥 Client Detailed Analytics
  async getClientAnalytics(clientId: string) {
    return this.dealModel.aggregate([
      { $match: { client: new Types.ObjectId(clientId) } },
      {
        $group: {
          _id: '$client',
          totalDeals: { $sum: 1 },
          totalValue: { $sum: '$value' },
          properties: { $push: '$unit' },
        },
      },
    ]);
  }
}