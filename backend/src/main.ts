import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalFilters(new AllExceptionsFilter());

  // Global prefix for all routes
  app.setGlobalPrefix('api')


  // CORS (so that the frontend can connect)
  app.enableCors()

  // Validation pipe (автоматическая валидация DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет поля которых нет в DTO
      forbidNonWhitelisted: true, // Выдаёт ошибку если есть лишние поля
      transform: true, // Автоматически преобразует типы
    }),
  );






  // ============================================
  // SWAGGER SETUP
  // ============================================
  const config = new DocumentBuilder()
    .setTitle('BookingPro API')
    .setDescription('Multi-Service Booking System REST API')
    .setVersion('1.0')
    .addBearerAuth() // Поддержка JWT токенов
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ============================================
  // START SERVER
  // ============================================
  const port = process.env.PORT || 3000;
  await app.listen(port);


  console.log(`
    🚀 Server is running on: http://localhost:${port}
    📚 Swagger docs: http://localhost:${port}/api/docs
    🔗 API base URL: http://localhost:${port}/api
  `);
}
bootstrap();
