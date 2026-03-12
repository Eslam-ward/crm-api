import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'OldPassword123!',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description:
      'New password. Must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character',
    example: 'NewPassword123!',
    minLength: 8,
    maxLength: 32,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}\-_=+|:;"'<>,./~`]).+$/,
    {
      message:
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Confirm new password (must match new password)',
    example: 'NewPassword123!',
  })
  @IsString()
  confirmPassword: string;
}