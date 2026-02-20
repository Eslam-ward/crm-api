// src/users/users.controller.ts
import { 
  Controller, 
  Get, 
  Param, 
  Put, 
  Delete, 
  Body, 
  Query,
  UseGuards, 
  
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { UserDocument } from './schema/users.schema';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
  @Get()
  async findAll(@Query() query: UsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDocument> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, dto);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }
}