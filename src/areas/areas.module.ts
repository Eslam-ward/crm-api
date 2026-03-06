import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from './schema/area.schema';
import { AreasAnalyticsService } from './areas-analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Area.name, schema: AreaSchema },
     
    ]),
  ],
  controllers: [AreasController],
  providers: [AreasService,AreasAnalyticsService ],
})
export class AreasModule {}
