import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DealStatus } from '../enums/deal-status.enums';

export class UpdateDealStatusDto {
  @ApiProperty({
    enum: DealStatus,
    example: DealStatus.NEW,
    description: 'Deal status',
  })
  @IsEnum(DealStatus)
  status: DealStatus;
}