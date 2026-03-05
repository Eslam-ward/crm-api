import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

import { LeadSource } from '../enums/LeadSource.enum';
import { LeadStatus } from '../enums/LeadStatus.enum';
import { Exists } from 'src/common/validators/id-exists.validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsPhoneNumberEGorSA } from 'src/common/validators/is-phone.validator';

export class CreateLeadDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the lead',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  fullName: string;

  @ApiProperty({
    example: '+201234567890',
    description: 'Egyptian or Saudi phone number',
    pattern: '^(\\+20|\\+966)',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumberEGorSA({
    message: 'Phone number must be valid Egyptian or Saudi number',
  })
  phone: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the lead',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    enum: LeadSource,
    example: LeadSource.WEBSITE,
    description: 'Source from where the lead was generated',
  })
  @IsEnum(LeadSource)
  @IsNotEmpty()
  source: LeadSource;

  @ApiProperty({
    enum: LeadStatus,
    example: LeadStatus.NEW,
    description: 'Current lead status',
  })
  @IsEnum(LeadStatus)
  @IsNotEmpty()
  status: LeadStatus;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'User ID assigned to this lead',
  })
  @IsMongoId()
  @Exists('User')
  assignedTo: string;

  @ApiPropertyOptional({
    example: 'Interested in enterprise package',
    description: 'Lead interest details',
  })
  @IsOptional()
  @IsString()
  interestedIn?: string;

  @ApiPropertyOptional({
    example: 'Follow up next week',
    description: 'Additional notes about the lead',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}