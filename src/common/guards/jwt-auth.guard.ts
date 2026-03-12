import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      throw new UnauthorizedException({
        success: false,
        message: 'Authentication failed. Please login again.',
        errorCode: 'AUTH_401',
      });
    }
    return user;
  }
}
