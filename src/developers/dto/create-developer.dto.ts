import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';
import { IsPhoneNumberEGorSA } from 'src/common/validators/is-phone.validator';

export class CreateDeveloperDto {
  @ApiProperty({
    example: 'Mohamed Ahmed',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'developer@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Senior Backend Developer with 5 years experience',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '+201001234567',
    description: 'Egyptian or Saudi phone number',
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumberEGorSA({
    message: 'Phone number must be valid Egyptian or Saudi number',
  })
  phone: string;

  @ApiPropertyOptional({
    example: 'Cairo, Egypt',
  })
  @IsString()
  @IsOptional()
  location?: string;
    @ApiPropertyOptional({
    example: 'website links',
  })
  @IsString()
  @IsOptional()
  site:string 

  @ApiPropertyOptional({
    type: [String],
    example: ['Nasr City', 'Maadi'],
    description: 'List of working areas',
  })
  @IsString({ each: true })
  @IsOptional()
  area?: string[];
}