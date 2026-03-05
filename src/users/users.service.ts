import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schema/users.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiFeatures } from 'src/common/utils/api-features';
import { buildQueryDto } from '../common/dto/base-query.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UploadService } from 'src/common/storage/upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
     private readonly imageService: UploadService,
  ) {}

  //  Find One (only active users)
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({
      _id: id,
    });

    if (!user)
      throw new NotFoundException(`No active user found with id: ${id}`);

    return UserResponseDto.fromEntity(user);
  }

  //  Update User
  async updateUser(id: string, dto: UpdateUserDto,files?: Express.Multer.File[],): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id);

    if (!user)
      throw new NotFoundException(`No active user found with id: ${id}`);
    if (dto.email) {
      const exists = await this.userModel.findOne({
        email: dto.email,
        _id: { $ne: id },
      });

      if (exists) {
        throw new ConflictException('Email already used');
      }
    }
    if (files?.length) {
      user.images = await this.imageService.replace(
        user.images,
        files,
      );
    }

    Object.assign(user, dto);
    await user.save();

    return UserResponseDto.fromEntity(user);
  }

  //  Soft Delete
  async softDelete(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!user) throw new NotFoundException(`No user found with id: ${id}`);

    return { message: 'User deactivated successfully' };
  }

  //  Hard Delete
  async hardDelete(id: string): Promise<{ message: string }> {
     const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.imageService.deleteImages(user.images);
 
    await user.deleteOne();
    return { message: 'User deleted permanently' };
  }

  //  Find All 

  async findAll(query: buildQueryDto) {
    const features = new ApiFeatures(
      this.userModel.find(),
      query,
    )
      .filter()
      .search(['email', 'fullName']);

    const total = await features.count();

    features.sort().limitFields().paginate(total);

    const data = await features.exec();

    return {
      results: data.length,
      pagination: features.paginationResult,
      data: data.map((user) => UserResponseDto.fromEntity(user)),
    };
  }
}
