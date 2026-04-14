import { Controller, Get, Post, Body, UseGuards, Query, Patch, Param, Delete, Res } from '@nestjs/common';
import { TreasuryService } from './treasury.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Transaction } from './schemas/transaction.schema';
import type { Response } from 'express';
import { UserRole } from 'src/users/enums/roles.enum';

@ApiTags('Treasury Transactions')
@ApiBearerAuth()
@Roles( UserRole.SUPER_ADMIN)
@Controller('treasury/transactions')
export class TreasuryController {
  constructor(private readonly treasuryService: TreasuryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully', type: Transaction })
  createTransaction(
    @Body() dto: CreateTransactionDto,
    @CurrentUser('_id') userId: string,
  ) {
    return this.treasuryService.createTransaction(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions with pagination and filter' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getTransactions(@Query() query: buildQueryDto) {
    return this.treasuryService.getTransactions(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get treasury stats (income, expense, net balance)' })
  getStats() {
    return this.treasuryService.getStats();
  }

  @Get('export')
  @ApiOperation({ summary: 'Export transactions to Excel' })
  async exportTransactions(@Res() res: Response,@Query() query: buildQueryDto) {
    const buffer = await this.treasuryService.exportTransactionsExcel(query);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="transactions.xlsx"',
    );

    res.end(buffer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  getTransactionById(@Param('id', ParseObjectIdPipe) transactionId: string) {
    return this.treasuryService.getTransactionById(transactionId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  updateTransaction(
    @Param('id', ParseObjectIdPipe) transactionId: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.treasuryService.updateTransaction(transactionId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  deleteTransaction(@Param('id', ParseObjectIdPipe) transactionId: string) {
    return this.treasuryService.deleteTransaction(transactionId);
  }
}