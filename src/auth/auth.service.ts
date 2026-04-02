import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

import { USERS_REPOSITORY } from '../users/repositories/users.repository.interface';
import type { IUsersRepository } from '../users/repositories/users.repository.interface';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { generateToken } from 'src/common/utils/generate-token';
import { UploadService } from 'src/common/storage/upload.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
    private readonly imageService: UploadService,
 
  ) {}

  // ── Register ───────────────────────────────────────────────

  async register(
    dto: RegisterDto,
    files: Express.Multer.File[],
  ): Promise<UserResponseDto> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const images = files?.length ? await this.imageService.upload(files) : [];
    const user = await this.usersRepository.create({ ...dto, images });

    const token = generateToken(user.id, this.jwtService);

    return UserResponseDto.fromEntity(user, token);
  }

  // ── Login ──────────────────────────────────────────────────

  async login(dto: LoginDto): Promise<UserResponseDto> {
    const start = Date.now();
    const user = await this.usersRepository.findByEmailWithPassword(dto.email);
    console.log('DB:', Date.now() - start);

    if (!user) throw new UnauthorizedException('Invalid email or password');

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account has been deactivated. Please contact support.',
      );
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');
    console.log('bcrypt:', Date.now() - start);

    const token = generateToken(user.id, this.jwtService);
    console.log('jwt:', Date.now() - start);


    return UserResponseDto.fromEntity(user, token);
  }

  // ── Forgot Password ────────────────────────────────────────

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new NotFoundException('No user found with this email');

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = crypto.createHash('sha256').update(resetCode).digest('hex');

    user.passwordResetCode = hashed;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;

    await this.usersRepository.save(user);

    // TODO: call email service here with resetCode

    return { message: 'Reset code sent' };
  }

  // ── Logout ─────────────────────────────────────────────────

  async logout(userId: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.refreshToken = undefined;
    await this.usersRepository.save(user);

    return { message: 'Logged out successfully' };
  }
}