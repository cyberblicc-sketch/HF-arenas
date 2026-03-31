import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/** Fail fast if critical environment variables are missing. */
function validateEnvironment(logger: Logger) {
  const required: string[] = [
    'DATABASE_URL',
    'RPC_URL',
    'ORACLE_PRIVATE_KEY',
    'USDC_ADDRESS',
    'GELATO_API_KEY',
  ];

  const warned: string[] = [
    'TRM_API_KEY',
    'SUMSUB_APP_TOKEN',
    'SUMSUB_SECRET_KEY',
  ];

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  const missingOptional = warned.filter((k) => !process.env[k]);
  if (missingOptional.length > 0) {
    logger.warn(`Missing recommended env vars (compliance may be degraded): ${missingOptional.join(', ')}`);
  }
}

async function bootstrap() {
  const logger = new Logger('bootstrap');
  validateEnvironment(logger);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.enableShutdownHooks();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('The Arena HF TOP Relayer API')
    .setDescription('Gasless relay, signature, and compliance endpoints.')
    .setVersion('1.3.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT || 3001);
  await app.listen(port);

  logger.log(`Relayer API listening on port ${port}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('bootstrap');
  logger.error('Failed to start application', error);
  process.exit(1);
});
