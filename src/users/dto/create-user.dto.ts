import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/users/enums/roles.enum';
import { IsPhoneNumberEGorSA } from 'src/common/validators/is-phone.validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Ahmed Mohamed',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  fullName: string;

  @ApiProperty({
    example: 'ahmed@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}\-_=+|:;"'<>,./~`]).+$/,
    {
      message:
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character',
    },
  )
  password: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

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


      
    
}
