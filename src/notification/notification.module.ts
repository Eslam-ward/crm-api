import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Notification, NotificationSchema } from './schema/notification.schema'
import { NotificationsService } from './notification.service';
import { NotificationsController } from './notification.controller';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
       JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,  // ← المهم دي
      signOptions: { expiresIn: '7d' },
    })
  ],
  providers: [NotificationsService, NotificationsGateway],
  controllers: [NotificationsController],
  exports: [NotificationsService], // عشان تستخدمه في modules تانية
})
export class NotificationModule {}