import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { User } from '../../users/schema/users.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: config.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    if (user.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        user.passwordChangedAt.getTime() / 1000,
      );

      if (changedTimestamp > payload.iat) {
        throw new UnauthorizedException(
          'Password changed recently. Please login again.',
        );
      }
    }

    return user;
  }
}
