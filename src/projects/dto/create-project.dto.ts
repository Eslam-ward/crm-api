import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsMongoId,
  IsOptional,

} from 'class-validator';

import { ProjectStatus } from '../schema/project.schema';
import { Exists } from 'src/common/validators/id-exists.validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Residential Project A',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Luxury residential project with modern design',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'New Cairo',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
   example: '65a1b2c3d4e5f6',
    description: 'Developer ID',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Exists('Area')
  area: string;

  @ApiProperty({
    example: '65a1b2c3d4e5f6',
    description: 'Developer ID',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Exists('Developer')
  developer: string;

  @ApiProperty({
    example: '2025-01-01',
    description: 'Project start date',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    enum: ProjectStatus,
    example: ProjectStatus.ACTIVE,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status: ProjectStatus;

}
