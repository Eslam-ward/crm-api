import { ConflictException, Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './repositories/transaction.repository';
import { mapCreateTransaction } from './mappers/create-transaction.mapper';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { mapUpdateTransaction } from './mappers/update-transaction.mapper';
import { TreasuryExportService } from './export/treasury-export.service';

@Injectable()
export class TreasuryService {
  constructor(
    private readonly transactionRepo: TransactionRepository,
     private readonly exportService: TreasuryExportService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createTransaction(dto: CreateTransactionDto, userId: string) {
    return this.connection.transaction(async (session) => {

    const exists = await this.transactionRepo.findDuplicate(dto, session);
    if (exists) {
      throw new ConflictException('Duplicate transaction detected');
    }
      return this.transactionRepo.create(
        mapCreateTransaction(dto, userId),
        session,
      );
    });
  }

async updateTransaction(transactionId: string, dto: UpdateTransactionDto) {
  return this.connection.transaction(async (session) => {
    const data = mapUpdateTransaction(dto);

   const exists = await this.transactionRepo.findDuplicate(dto, session);
    if (exists) {
      throw new ConflictException('Duplicate transaction detected');
    }

    // 2️⃣ Perform update
    return this.transactionRepo.update(transactionId, data, session);
  });
}

  getTransactions(query: buildQueryDto) {
    return this.transactionRepo.findAll(query);
  }

  getStats() {
    return this.transactionRepo.getStats();
  }

  getTransactionById(transactionId: string) {
    return this.transactionRepo.findById(transactionId);
  }

  async deleteTransaction(transactionId: string) {
    return this.connection.transaction(async (session) => {
      return this.transactionRepo.delete(transactionId, session);
    });
  }
   async exportTransactionsExcel(query: buildQueryDto) {

    const transactions = await this.transactionRepo.findForExport(query);

    return this.exportService.generateTransactionsExcel(transactions);
  }

}
