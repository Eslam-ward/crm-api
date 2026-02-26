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
  
  @IsNotEmpty()
  @IsMongoId()
  @Exists('Project')
  project: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unitCode: string;

  @IsEnum(UnitType)
  type: UnitType;

  @IsEnum(UnitPurpose)
  purpose: UnitPurpose;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;


  @IsNotEmpty()
  @IsString()
  area: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  floor: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phase: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  apartmentNumber?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  size: number;

  @IsOptional()
  @IsEnum(UnitStatus)
  status: UnitStatus;
}