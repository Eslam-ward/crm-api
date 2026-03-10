import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schema/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadService } from 'src/common/storage/upload.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

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
  controllers: [UsersController],
  providers: [UsersService,UploadService]
})
export class UserModule {}
