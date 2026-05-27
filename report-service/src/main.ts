import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException({
          success: false,
          errors: errors.map((error) => ({
            field: error.property,
            constraints: error.constraints,
          })),
        }),
    }),
  );

  // CORS
  app.enableCors();

  // Health check
  app.use('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Report Service is running' });
  });

  const port = process.env.PORT || 3007;
  await app.listen(port);
  console.log(`Report Service running on port ${port}`);
}

bootstrap();
