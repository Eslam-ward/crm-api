import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { EventType } from '../enums/event-type.enum';
import { Exists } from 'src/common/validators/id-exists.validator';
import { string } from 'joi';

export class CreateEventDto {

  @ApiProperty({
    example: 'Property Viewing - Villa B12',
    description: 'Title of the event',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    enum: EventType,
    example: EventType.PROPERTY_VIEWING,
    description: 'Type of event',
  })
  @IsNotEmpty()
  @IsEnum(EventType)
  type: EventType;
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the user who created the event',  
  })
  @IsNotEmpty()
  @IsString()

   createdBy: string

  @ApiProperty({
    example: '2026-03-22',
    description: 'Event date in ISO format (YYYY-MM-DD)',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    example: '11:00',
    description: 'Event time in 24-hour format (HH:mm)',
  })
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty({
    example: 'Madinaty',
    description: 'Event location',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    example: '69ab5aa05f87a95ba63426b7',
    description: 'Client ID',
  })
  @IsNotEmpty()
  @IsString()
  client: string;

  @ApiProperty({
    example: '69ab42b1d37fe207b6182ed0',
    description: 'User ID assigned to this event',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Exists('User')
  assignedTo: string;

  @ApiPropertyOptional({
    example: 'Client interested in investment',
    description: 'Additional notes about the event',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}