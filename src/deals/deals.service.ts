import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deal, DealDocument, DealStatus } from './schema/deal.schema';
import { Unit, UnitDocument } from '../units/schema/unit.schema';
import{UnitStatus} from '../units/enums/unit-status.enum';

import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStatusDto } from './dto/update-deal-status.dto';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ApiFeatures } from 'src/common/utils/api-features';
import { UpdateDealDto } from './dto/update-deal.dto';
import { formatMoneyValue } from 'src/common/helpers/money-format.helper';

@Injectable()
export class DealsService {
  constructor(
    @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
  ) {}

  async create(createDealDto: CreateDealDto): Promise<Deal> {
    const unit = await this.unitModel.findById(createDealDto.unit);

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (unit.status === UnitStatus.SOLD) {
      throw new BadRequestException('Unit already sold');
    }

    return this.dealModel.create(createDealDto);
  }

  async findAll(query: buildQueryDto) {
    const features = new ApiFeatures(
      this.dealModel.find().populate('unit', 'images unitCode type -_id').populate('salesAgent','fullName -_id'),
      query,
    )
      .filter()
      .search(['unitCode', 'type']);

    const total = await features.count();

    features.sort().limitFields().paginate(total);

    const data = await features.exec();

    return {
      results: data.length,
      pagination: features.paginationResult,
      data: data,
    };
  }

  // find one deal with populated unit and sales agent
  async findOne(id: string): Promise<Deal> {
    const deal = await this.dealModel
      .findById(id)
      .populate('unit', 'images unitCode type -_id')
      .populate('salesAgent', 'fullName -_id');
      
    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return deal;
  }

  async updateStatus(id: string, dto: UpdateDealStatusDto) {
    const deal = await this.dealModel.findById(id);

    if (!deal) throw new NotFoundException('Deal not found');

    const unit = await this.unitModel.findById(deal.unit);

    if (!unit) throw new NotFoundException('Unit not found');

    

    // Business Rules

    if (dto.status === DealStatus.RESERVATION) {
      if (unit.status !== UnitStatus.AVAILABLE) {
        throw new BadRequestException('Unit not available');
      }

      unit.status = UnitStatus.RESERVED;
      await unit.save();
    }

    if (dto.status === DealStatus.CLOSED_WON) {
      if (unit.status === UnitStatus.SOLD) {
        throw new BadRequestException('Unit already sold');
      }

      unit.status = UnitStatus.SOLD;
      await unit.save();
    }

    deal.status = dto.status;
    return deal.save();
  }
 
  // -----------------------
  async update(id: string, updateDealDto: UpdateDealDto) {
  const deal = await this.dealModel.findById(id);

  if (!deal) {
    throw new NotFoundException('Deal not found');
  }

 
  if (updateDealDto.status) {
    throw new BadRequestException(
      'Use /status endpoint to update deal status',
    );
  }

  Object.assign(deal, updateDealDto);

  return deal.save();
}

// delete deal and set unit back to available if not closed won
  async remove(id: string): Promise<{ message: string }> {
    const deal = await this.dealModel.findById(id);
    if (!deal) {
      throw new NotFoundException('Deal not found');
    }
    if (deal.status !== DealStatus.CLOSED_WON) {
      const unit = await this.unitModel.findById(deal.unit);
      if (unit) {
        unit.status = UnitStatus.AVAILABLE;
        await unit.save();
      }
    }
    await this.dealModel.findByIdAndDelete(id);
    return { message: 'Deal deleted successfully' };
    }




async getPipelineSummary() {
  const result = await this.dealModel.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
      },
    },
  ]);

  const statuses = [
    'NEW',
    'NEGOTIATION',
    'RESERVATION',
    'CLOSED_WON',
    'CLOSED_LOST',
  ];

  const summary = {};

  statuses.forEach((status) => {
    const found = result.find((r) => r._id === status);

    summary[status] = {
      count: found?.count || 0,
      totalValue: formatMoneyValue(found?.totalValue || 0),
    };
  });

  return summary;
}
  }