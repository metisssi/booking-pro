import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { BookingsModule } from './modules/bookings/bookings.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // .env avaible everywhere 
    }),
    PrismaModule, 
    AuthModule, PropertiesModule, BookingsModule, BookingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}