import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { IsPhoneNumberEGorSA } from 'src/common/validators/is-phone.validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'Ahmed Mohamed',
    description: 'Full name of the client',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: '+201234567890',
    description: 'Egyptian or Saudi phone number',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumberEGorSA({
    message: 'Phone number must be valid Egyptian or Saudi number',
  })
  phone: string;
  
  @ApiProperty({
    example: 'ahmed@gmail.com',
    description: 'Client email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Cairo',
    description: 'City of the client',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'Egypt',
    description: 'Country of the client',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({
    example: 'VIP client - high priority',
    description: 'Additional notes about the client',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}