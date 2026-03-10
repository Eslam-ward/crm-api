import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/schema/users.schema';
import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { generateToken } from 'src/common/utils/generate-token';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'src/common/storage/upload.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
      private jwtService: JwtService,
      private readonly imageService: UploadService,

  
  ) {}

  async register(dto: RegisterDto,files: Express.Multer.File[], ): Promise<UserResponseDto> {
    // check if email exists
    const existing = await this.userModel.findOne({ email: dto.email });

    if (existing)
      throw new UnauthorizedException(
        'Email already in use',
      );
      const images = files?.length
    ? await this.imageService.upload(files)
    : [];
    const user = await this.userModel.create({ ...dto, images });

    const token =  generateToken(user.id, this.jwtService);

    return UserResponseDto.fromEntity(user, token)
  }
//   login

  async login(dto: LoginDto): Promise<UserResponseDto>  {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+password');

    if (!user)
      throw new UnauthorizedException(
        'Invalid email or password',
      );

    const isMatch = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isMatch)
      throw new UnauthorizedException(
        'Invalid email or password',
      );

    const token = generateToken(user.id, this.jwtService);

   return UserResponseDto.fromEntity(user, token);
  }

//   forgot password
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user)
      throw new NotFoundException(
        `No user found with this email`,
      );

    const resetCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const hashed = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    user.passwordResetCode = hashed;
    user.passwordResetExpires = new Date(
      Date.now() + 10 * 60 * 1000,
    );
    user.passwordResetVerified = false;

    await user.save();

    // call email service here

    return { message: 'Reset code sent' };
  }

  // logout
async logout(userId: string): Promise<{ message: string }> {
  const user = await this.userModel.findById(userId);
  if (!user) throw new NotFoundException('User not found');

  user.refreshToken = undefined;
  await user.save();

  return { message: 'Logged out successfully' };
}


}
