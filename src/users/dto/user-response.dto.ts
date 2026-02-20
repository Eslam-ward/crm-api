import { UserRole } from 'src/common/enums/roles.enum';
import { User } from '../schema/users.schema';
import { Types } from 'mongoose';

export class UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string;
  accessToken?: string;

  static fromEntity(user: User & { _id: Types.ObjectId }, accessToken?: string): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user._id.toString();
    dto.email = user.email;
    dto.fullName = user.fullName;
    dto.phone = user.phone;
    dto.role = user.role;
    if (accessToken) dto.accessToken = accessToken;
    return dto;
  }
}
