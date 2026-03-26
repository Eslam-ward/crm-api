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
  ValidateIf,
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
  @MaxLength(30)
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
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: '65a1b2c3d4e5f6',
    description: 'Area ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  @Exists('Area')
  area: string;

  @ApiPropertyOptional({
    example: 'Cash',
  })
  @IsOptional()
  @IsString()
  paymentType?: string;

  @ApiProperty({
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  // ================= COMMON =================

  @ApiPropertyOptional({
    example: 5,
    minimum: 0,
    description: 'Required for apartment',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  floor?: number;

  @ApiPropertyOptional({
    example: 'New Cairo - Fifth Settlement',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  location?: string;

  @ApiPropertyOptional({
    example: 12,
  })
  @IsOptional()
  
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
    example: 120,
    description: 'Size in square meters',
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

 @ApiPropertyOptional({
    description: 'notes',
  })
  @IsOptional()
  @IsString()
  notes:string



  // ================= APARTMENT =================



  @ApiPropertyOptional({
    example: 'B1',
    description: 'Required if type = apartment',
  })
 @IsOptional()
  @IsString()
  building?: string;
   @IsOptional()
  @IsString()
  group: string;

  // ================= VILLA =================

  @ApiPropertyOptional({
    example: 'Block A',
    description: 'Required if type = villa',
  })
 @IsOptional()
  @IsString()
  block?: string;

  @ApiPropertyOptional({
    example: 'Villa 12',
    description: 'Required if type = villa',
  })
 @IsOptional()
  @IsString()
  villaNumber?: string;
}
