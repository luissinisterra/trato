import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:4200';
  const rawOrigins = corsOrigin.split(',').map((o) => o.trim()).filter(Boolean);

  // Separa exactos de wildcards (*.dominio.com → regex que matchea cualquier subdominio)
  const exactOrigins = rawOrigins.filter((o) => !o.startsWith('*.'));
  const wildcardPatterns = rawOrigins
    .filter((o) => o.startsWith('*.'))
    .map((o) => new RegExp('^https?://' + o.slice(2).replace(/\./g, '\\.') + '$'));

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (exactOrigins.includes(origin)) return callback(null, true);
      if (wildcardPatterns.some((re) => re.test(origin))) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Gateway Service running on port ${port}`);
}

bootstrap();
