import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigrationModule } from './configration/configration.module';
import { ConfigrationService } from './configration/configration.service';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
@Module({
  imports: [UserModule, ConfigrationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigrationModule],
      useFactory: async (configService: ConfigrationService) => (
        configService.mongooseConfig
      ),
      inject: [ConfigrationService],
    }),
    LoggerModule,
    AuthModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
