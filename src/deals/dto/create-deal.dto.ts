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
import { DealStatus } from '../schema/deal.schema';
import { Exists } from 'src/common/validators/id-exists.validator';

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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes: string;
}