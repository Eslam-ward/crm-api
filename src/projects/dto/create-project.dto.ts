import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsMongoId,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { ProjectStatus } from '../schema/project.schema';
import { Exists } from 'src/common/validators/id-exists.validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  area: string;
 @IsNotEmpty()
  @IsMongoId()
  @Exists('Developer')
  
  developer: string;

  @IsDateString()
  startDate: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalUnits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  availableUnits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  soldUnits?: number;

  // images will be injected by the controller after upload — not sent by client
}