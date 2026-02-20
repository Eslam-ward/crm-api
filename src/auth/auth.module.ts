// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

import { User, UserSchema } from '../users/schema/users.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  imports: [
    
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),


    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('jwt.secret'),

        signOptions: {
          expiresIn:
            config.getOrThrow<StringValue>('jwt.expiresIn'),
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
