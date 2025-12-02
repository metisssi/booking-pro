import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { PropertiesModule } from './modules/properties/properties.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // .env доступен везде
    }),
    PrismaModule, // 👈 Добавили!
    AuthModule, PropertiesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}