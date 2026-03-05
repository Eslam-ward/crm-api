import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  
  ApiOperation,
  ApiOkResponse,
  
  ApiParam,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { buildQueryDto } from '../common/dto/base-query.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: buildQueryDto) {
    return this.usersService.findAll(query);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ type: UserResponseDto })
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ type: UserResponseDto })
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 5))
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, dto, files);
  }
// Soft Delete - Admin Only
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User deactivated successfully' })
  @Delete(':id')
  async softDelete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.softDelete(id);
  }

  // hard delete - Admin Only
  @ApiOperation({ summary: 'Delete user permanently' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @Delete(':id/delete')
  async hardDelete(@Param('id',ParseObjectIdPipe) id: string) {
    return this.usersService.hardDelete(id);

  }
}