import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsMongoId,
} from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';
import { Exists } from 'src/common/validators/id-exists.validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType, description: 'Type of transaction' })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ description: 'Transaction amount' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Transaction category' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ description: 'Transaction source' })
  @IsOptional()
  @IsString()
  source: string;

  @ApiPropertyOptional({ description: 'Linked deal ID' })
  @IsOptional()
  @IsMongoId()
  @Exists('Deal')
  linkedDeal: string;

  @ApiPropertyOptional({ description: 'Sales agent ID' })
  @IsOptional()
  @IsMongoId()
  @Exists('User')
  salesAgent: string;

  @ApiProperty({ description: 'Transaction date', type: String, format: 'date-time' })
  @IsNotEmpty()
  date: Date;

  @ApiPropertyOptional({ description: 'Optional notes' })
  @IsOptional()
  @IsString()
  notes: string;
}