
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';

export function generateToken(userId: string, jwtService: JwtService) {
  return jwtService.sign({ userId });
}

export function generateTokens(
  userId: string,
  jwtService: JwtService,
  configService: ConfigService,
) {
  const payload = { sub: userId };

  const accessToken = jwtService.sign(payload);


  const refreshToken = jwtService.sign(payload, {
    secret: configService.getOrThrow<string>('refreshToken.secret'),
    expiresIn: configService.getOrThrow<StringValue>(
      'refreshToken.expiresIn',
    ),
  });

  return { accessToken, refreshToken };
}
