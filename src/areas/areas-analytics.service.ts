import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UnitStatus } from "src/units/enums/unit-status.enum";
import { Area } from "./schema/area.schema";
import { Model, Types } from "mongoose";
import { AreaViewResponse } from "./interfaces/area-view-response.interface";

@Injectable()
export class AreasAnalyticsService {
  constructor(
    @InjectModel(Area.name)
    private readonly areaModel: Model<Area>,
  ) {}




async findByIds(
  ids: Types.ObjectId[],
): Promise<AreaViewResponse[]> {

  return this.areaModel.aggregate<AreaViewResponse>([
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
            $project: {
              status: 1,
            },
          },
        ],
        as: 'units',
      },
    },

    {
      $addFields: {
        'stats.totalUnits': { $size: '$units' },

        'stats.availableUnits': {
          $size: {
            $filter: {
              input: '$units',
              as: 'unit',
              cond: {
                $eq: ['$$unit.status', UnitStatus.AVAILABLE],
              },
            },
          },
        },
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
      $project: {
        _id:1,
        name: 1,
        location: 1,
        type: 1,
        description: 1,
        group: 1,
        stats: 1,
      },
    },
  ]);
}



}
