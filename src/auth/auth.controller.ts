import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
@Throttle({ default: { limit: 5, ttl: 60000 } })
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register new user' })
  @ApiCreatedResponse({ description: 'User registered successfully' })
  @Post('register')
  @UseInterceptors(FilesInterceptor('images',5))
  signup(@Body() dto: RegisterDto,@UploadedFiles() files: Express.Multer.File[]) {
    return this.authService.register(dto, files);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ description: 'User logged in successfully' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User logged out successfully' })
  @UseGuards(JwtAuthGuard)
  @Post('logout/:id')
  async logout(@Param('id') userId: string) {
    return this.authService.logout(userId);
  }

  @ApiOperation({ summary: 'Send password reset email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'ahmed@example.com' },
      },
    },
  })
  @ApiOkResponse({ description: 'Password reset email sent' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  forgot(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }
}