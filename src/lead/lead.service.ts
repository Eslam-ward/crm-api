import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Lead, LeadDocument } from './schema/lead.schema';
import { CreateLeadDto } from './dto/create-lead.dto';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ApiFeatures } from 'src/common/utils/api-features';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-LeadStatus.dto';
import { LeadsAnalyticsService } from './leads-analytics.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name)
    private readonly leadModel: Model<LeadDocument>,
    private readonly analyticsService: LeadsAnalyticsService,
  ) {}

 
  async create(dto: CreateLeadDto): Promise<Lead> {
    return this.leadModel.create(dto);
  }


  async findAll(query:buildQueryDto) {
      const features = new ApiFeatures(
         this.leadModel.find().populate("assignedTo","fullName").lean(),
      
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

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadModel.findById(id).populate("assignedTo fullName");

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }


  async updateStatus(id: string, dto: UpdateLeadStatusDto): Promise<Lead> {
    const lead = await this.leadModel.findById(id);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    lead.status = dto.status;
    await lead.save();

    return lead;
  }

  async update(id: string, updateDto:UpdateLeadDto): Promise<Lead> {
     const lead = await this.leadModel.findByIdAndUpdate(
    id,
    updateDto,
    { new: true }
  );

  if (!lead) {
    throw new NotFoundException('Lead not found');
  }

  return lead;
  }

 
  async remove(id: string): Promise<{ message: string }> {
    const lead = await this.leadModel.findByIdAndDelete(id);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    return {
      message: 'Lead deleted successfully',
    };
  }

async dashboardSummery() {
  return this.analyticsService.getStatusSummary();
}
}