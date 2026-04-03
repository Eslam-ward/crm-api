import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Patch,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse
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
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)

export class UsersController {
  constructor(private readonly usersService: UsersService) {}


    @ApiOperation({ summary: 'create new user' })
    @ApiCreatedResponse({ description: 'User created successfully' })
    @Roles('super_admin', 'admin')
    @Post('create')
    @UseInterceptors(FilesInterceptor('images',10))
    create(@Body() dto:CreateUserDto,@UploadedFiles() files: Express.Multer.File[]) {
      return this.usersService.create(dto, files);
    }


  @Roles('super_admin', 'admin')
  @Get()
  async findAll(@Query() query: buildQueryDto){
    return this.usersService.findAll(query);
  }
   @ApiOperation({ summary: 'Change user password' })
  @ApiOkResponse({ description: 'Password changed  successfully' })
  @Patch('change-password')
async changePassword(@CurrentUser('_id') userId: string, @Body() dto: ChangePasswordDto) {
  return this.usersService.changePassword(userId, dto);
}

  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ type: UserResponseDto })
  @Roles('super_admin', 'admin')
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ type: UserResponseDto })
  @Roles('super_admin', 'admin')
  @UseInterceptors(FilesInterceptor('images', 2))
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, dto, files);
  }
// Soft Delete - Admin Only
@Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Deactivate || Reactive user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User deactivated ||Reactive successfully' })
  @Patch(':id/activations')
  async deactivateUser(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.toggleUserActive(id);
  }

  // hard delete - Admin Only
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Delete user permanently' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @Delete(':id/delete')
  async hardDelete(@Param('id',ParseObjectIdPipe) id: string) {
    return this.usersService.hardDelete(id);

  }
 
}
