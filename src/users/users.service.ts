import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { USERS_REPOSITORY } from './repositories/users.repository.interface';
import type { IUsersRepository } from './repositories/users.repository.interface';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { buildQueryDto } from '../common/dto/base-query.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import type { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UploadService } from 'src/common/storage/upload.service';
import { generateToken } from 'src/common/utils/generate-token';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly imageService: UploadService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    dto: CreateUserDto,
    files: Express.Multer.File[],
  ): Promise<UserResponseDto> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const images = files?.length ? await this.imageService.upload(files) : [];

    const user = await this.usersRepository.create({ ...dto, images });

    const token = generateToken(user.id, this.jwtService);

    return UserResponseDto.fromEntity(user, token);
  }


  async findAll(query: buildQueryDto) {
    const { results, pagination, data } =
      await this.usersRepository.findAll(query);

    return {
      results,
      pagination,
      data: data.map((user) => UserResponseDto.fromEntity(user)),
    };
  }


  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(`No active user found with id: ${id}`);

    return UserResponseDto.fromEntity(user);
  }


  async updateUser(
    id: string,
    dto: UpdateUserDto,
    files?: Express.Multer.File[],
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(`No active user found with id: ${id}`);

    if (dto.email) {
      const emailTaken = await this.usersRepository.findByEmailExcludingId(
        dto.email,
        id,
      );
      if (emailTaken) throw new ConflictException('Email already used');
    }

    if (files?.length) {
      dto['images'] = await this.imageService.replace(user.images, files);
    }

    const updated = await this.usersRepository.updateById(user, dto);

    return UserResponseDto.fromEntity(updated);
  }


  async toggleUserActive(
    userId: string,
  ): Promise<{ message: string; isActive: boolean }> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.isActive) {
      user.isActive = false;
      user.refreshToken = undefined;
      await this.usersRepository.save(user);
      return { message: 'User deactivated successfully', isActive: false };
    }

    user.isActive = true;
    await this.usersRepository.save(user);
    return { message: 'User activated successfully', isActive: true };
  }


  async hardDelete(id: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.imageService.deleteImages(user.images);
    await this.usersRepository.deleteOne(user);

    return { message: 'User deleted permanently' };
  }


  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersRepository.findByIdWithPassword(userId);
    if (!user) throw new NotFoundException(`User not found with id: ${userId}`);

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new ForbiddenException('Current password is incorrect');

    if (dto.password !== dto.confirmPassword) {
      throw new ForbiddenException('Password and confirm password must match');
    }

    user.password = dto.password;
    await this.usersRepository.save(user);

    const newToken = generateToken(user.id, this.jwtService);

    return {
      message: 'Password changed successfully',
      accessToken: newToken,
    };
  }
}