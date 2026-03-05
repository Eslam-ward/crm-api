import { Module } from '@nestjs/common';
import { LeadsService } from './lead.service';
import { LeadsController } from './lead.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lead, LeadSchema } from './schema/lead.schema';
import { LeadsAnalyticsService } from './leads-analytics.service';
@Module({
  imports: [
      MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
  ], 
  controllers: [LeadsController],
  providers: [LeadsService,LeadsAnalyticsService],
})
export class LeadModule {}
