import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/common/enums/roles.enum';
import { IsPhoneNumberEGorSA } from 'src/common/validators/is-phone.validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Ahmed Mohamed',
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  fullName: string;

  @ApiPropertyOptional({
    example: 'ahmed@example.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({
    example: '+201001234567',
    description: 'Egyptian or Saudi phone number',
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumberEGorSA({
    message: 'Phone number must be valid Egyptian or Saudi number',
  })
  phone: string;

  @ApiPropertyOptional({
    enum: UserRole,
    enumName: 'UserRole',
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}