import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Area } from './schema/area.schema';
import { UnitStatus } from 'src/units/enums/unit-status.enum';
import { IAreaViewResponse } from './interfaces/area-view-response.interface';

@Injectable()
export class AreasAnalyticsService {
  constructor(
    @InjectModel(Area.name)
    private readonly areaModel: Model<Area>,
  ) {}

async findByIds(ids: Types.ObjectId[]): Promise<IAreaViewResponse[]> {
  return this.areaModel.aggregate<IAreaViewResponse>([
    {
      $match: {
        _id: { $in: ids },
      },
    },

    {
      $lookup: {
        from: 'units',
        let: { areaId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$area', '$$areaId'],
              },
            },
          },

        
          {
            $group: {
              _id: null,
              totalUnits: { $sum: 1 },
              availableUnits: {
                $sum: {
                  $cond: [
                    { $eq: ['$status', UnitStatus.AVAILABLE] },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
        as: 'stats',
      },
    },

    {
      $unwind: {
        path: '$stats',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $addFields: {
        'stats.totalUnits': { $ifNull: ['$stats.totalUnits', 0] },
        'stats.availableUnits': { $ifNull: ['$stats.availableUnits', 0] },
      },
    },

    {
      $addFields: {
        'stats.availabilityPercentage': {
          $cond: [
            { $eq: ['$stats.totalUnits', 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        '$stats.availableUnits',
                        '$stats.totalUnits',
                      ],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
          ],
        },
      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },
    {
  $unset: 'stats._id',
},

    {
      $project: {
       
        _id: 1,
        name: 1,
        location: 1,
        description: 1,
        stats: 1,
      },
    },
  ]);
}
}
