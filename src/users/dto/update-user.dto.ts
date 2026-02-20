import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/common/enums/roles.enum';
import { IsPhoneNumberEGorSA } from 'src/common/validators/is-phone.validator';

export class UpdateUserDto {
 @IsString()
  @IsOptional()
  @MinLength(6)
  fullName: string;
  @IsEmail()
  @IsOptional()
  email: string;

   @IsOptional()
   @IsString()
   @IsPhoneNumberEGorSA({
     message: 'Phone number must be valid Egyptian or Saudi number',
   })
   phone: string;
 @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}