import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsEnum,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Exists } from 'src/common/validators/id-exists.validator';

export class CreateAreaDto {

  @ApiProperty({
    example: 'B1',
    description: 'Area name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;


  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'Project ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  @Exists('Project')
  project: string;


  @ApiPropertyOptional({
    example: 'This area is located near main road',
  })
  @IsOptional()
  @IsString()
  
  description?: string;


  @ApiProperty({
    example: 'New Cairo - District 5',
  })
  @IsString()
  @IsNotEmpty()
  location: string;
   @ApiPropertyOptional({
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
   createdBy: string;


  @ApiPropertyOptional({
    example: true,
    description: 'Is area active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}