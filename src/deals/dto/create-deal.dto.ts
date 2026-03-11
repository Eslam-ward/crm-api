import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exists } from 'src/common/validators/id-exists.validator';
import { DealStatus } from '../enums/deal-status.enums';
import { Type } from 'class-transformer';
import { PaymentType } from '../enums/payment-type.enums';

export class CreateDealDto {
  @ApiProperty({
    example: 'New Deal',
    description: 'Deal title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 500000,
    description: 'Deal value',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  value: number;

  @ApiPropertyOptional({
    enum: DealStatus,
    example: DealStatus.NEW,
  })
  @IsNotEmpty()
  @IsEnum(DealStatus)
  @IsOptional()
  status: DealStatus;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Exists('Unit')
  unit: string;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c86',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Exists('User')
  salesAgent: string;

 @ApiProperty({
    example: '60d21b4667d0d8992e610c86',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Exists('Client')
  client: string;

    
  @ApiProperty({
    description: 'Payment type',
    enum: PaymentType,
    example: PaymentType.CASH,
  })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({
    description: 'Paid amount in EGP',
    example: 50,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  paidAmount: number;

  @ApiProperty({
    description: 'Remaining amount in EGP',
    example: 150,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  remainingAmount: number;

@ApiPropertyOptional({
  description: 'Required Amount in EGP',
  example: 1500000,
  minimum: 0,
})
@IsOptional()
@Type(() => Number)
@IsNumber()
@Min(0)
requiredAmount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes: string;
}