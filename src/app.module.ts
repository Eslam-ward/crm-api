import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { DevelopersModule } from './developers/developers.module';
import { ProjectsModule } from './projects/projects.module';
import { StorageModule } from './common/storage/storage.module';
import { UnitsModule } from './units/units.module';
import { DealsModule } from './deals/deals.module';
import { ClientModule } from './client/client.module';
import { LeadModule } from './lead/lead.module';
import { AreasModule } from './areas/areas.module';
import { EventModule } from './event/event.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TreasuryModule } from './treasury/treasury.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.getOrThrow<number>('rateLimit.ttl'),
            limit: config.getOrThrow<number>('rateLimit.limit'),
          },
        ],
      }),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('database.uri'),
      }),
    }),

       CacheModule.register({
      ttl: 60,
      isGlobal: true, 
    }),

    AuthModule,
    UserModule,
    DevelopersModule,
    ProjectsModule,
    StorageModule,
    UnitsModule,
    DealsModule,
    ClientModule,
    LeadModule,
    AreasModule,
    EventModule,
    DashboardModule,
    TreasuryModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
       {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor, 
    },
  ],
})
export class AppModule {}
