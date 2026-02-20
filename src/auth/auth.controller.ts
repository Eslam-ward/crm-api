import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  signup(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

   @UseGuards(JwtAuthGuard)
   @Post('logout/:id')
  async logout(@Param('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Post('forgot-password')
  forgot(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

}
