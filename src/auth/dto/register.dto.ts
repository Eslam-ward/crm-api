import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/common/enums/roles.enum';
import { IsPhoneNumberEGorSA } from 'src/common/validators/is-phone.validator';

export class RegisterDto {
 @IsString()
  @IsNotEmpty()
  @MinLength(6)
  fullName: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(8)
  password: string;
 @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumberEGorSA({
    message: 'Phone number must be valid Egyptian or Saudi number',
  })
  phone: string;
  
}