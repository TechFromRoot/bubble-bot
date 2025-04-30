import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramModule } from './telegram/telegram.module';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import environmentValidation from 'src/config/environment.validation';

const ENV = process.env.NODE_ENV;

dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? ".env" : `.env.${ENV}`,
      load: [appConfig],
      validationSchema: environmentValidation
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!), TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }