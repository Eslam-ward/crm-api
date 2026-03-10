import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  IsMongoId,
  MaxLength,

} from 'class-validator';
import { Type } from 'class-transformer';

import { UnitType } from '../enums/unit-type.enum';
import { UnitStatus } from '../enums/unit-status.enum';
import { UnitPurpose } from '../enums/unit-purpose.enum';
import { Exists } from 'src/common/validators/id-exists.validator';

export class CreateUnitDto {
  @ApiProperty({
    example: '65a1b2c3d4e5f6',
    description: 'Project ID',
  })
  @IsMongoId()
  @IsNotEmpty()

  @Exists('Project')
  project: string;

  @ApiProperty({
    example: 'A-101',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unitCode: string;

  @ApiProperty({
    enum: UnitType,
    example: UnitType.APARTMENT,
  })
  @IsEnum(UnitType)
  type: UnitType;

  @ApiProperty({
    enum: UnitPurpose,
    example: UnitPurpose.SALE,
  })
  @IsEnum(UnitPurpose)
  purpose: UnitPurpose;

  @ApiProperty({
    example: 1200000,
    minimum: 0,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'B1',
  })
  @IsMongoId()
  @IsNotEmpty()

  @Exists('Area')
  area: string;

  @ApiPropertyOptional({
    example: 5,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  floor: number;

  @ApiPropertyOptional({
    example: 'Phase 1',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phase: string;

  @ApiPropertyOptional({
    example: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  apartmentNumber?: number;

  @ApiProperty({
    example: 2,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms: number;

  @ApiProperty({
    example: 2,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms: number;

  @ApiProperty({
    example: '90 M',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  size: number;

  @ApiPropertyOptional({
    enum: UnitStatus,
    example: UnitStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(UnitStatus)
  status: UnitStatus;

  
}
