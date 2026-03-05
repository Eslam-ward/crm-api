import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Deal, DealSchema } from 'src/deals/schema/deal.schema';
import { Client, ClientSchema } from './schema/client.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: Deal.name, schema: DealSchema }, // needed for analytics
    ]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
