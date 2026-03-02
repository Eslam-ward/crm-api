import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schema/users.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiFeatures } from 'src/common/utils/api-features';
import {buildQueryDto } from '../common/dto/base-query.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService  {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  //  Find One (only active users)
  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      _id: id,
     
    });

    if (!user)
      throw new NotFoundException(`No active user found with id: ${id}`);

    return user;
  }

  //  Update User
  async updateUser(
    id: string,
    dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id},
      dto,
      { new: true },
    );

    if (!user)
      throw new NotFoundException(`No active user found with id: ${id}`);

    return UserResponseDto.fromEntity(user);
  }

  //  Soft Delete
  async softDelete(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!user)
      throw new NotFoundException(`No user found with id: ${id}`);

    return { message: 'User deactivated successfully' };
  }

  //  Hard Delete
  async hardDelete(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user)
      throw new NotFoundException(`No user found with id: ${id}`);

    return { message: 'User deleted successfully' };
  }

  

  //  Find All (only active users)

async findAll(query: buildQueryDto) {
  const features = new ApiFeatures(
    this.userModel.find({ active: true }),
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
