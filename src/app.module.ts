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


@Module({
  imports: [
    
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
    EventModule
 
  ],
})
export class AppModule {}
