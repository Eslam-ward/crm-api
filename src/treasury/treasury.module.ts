import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Transaction, TransactionSchema } from './schemas/transaction.schema';

import { TreasuryService } from './treasury.service';
import { TreasuryController } from './treasury.controller';

import { TransactionRepository } from './repositories/transaction.repository';
import { TreasuryExportService } from './export/treasury-export.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
     
    ]),
  ],
  controllers: [TreasuryController],
  providers: [
    TreasuryService,
    TransactionRepository,
    TreasuryExportService
  ],
})
export class TreasuryModule {}