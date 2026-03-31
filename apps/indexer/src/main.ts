import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';

/** Fail fast if critical environment variables are missing. */
function validateEnvironment(logger: Logger) {
  const required: string[] = ['DATABASE_URL'];
  const warned: string[] = ['SUBGRAPH_URL'];

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  const missingOptional = warned.filter((k) => !process.env[k]);
  if (missingOptional.length > 0) {
    logger.warn(`Missing recommended env vars (sync will be disabled): ${missingOptional.join(', ')}`);
  }
}

async function bootstrap() {
  const logger = new Logger('bootstrap');
  validateEnvironment(logger);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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

  const port = Number(process.env.PORT || 3002);
  await app.listen(port);

  logger.log(`Indexer API listening on port ${port}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('bootstrap');
  logger.error('Failed to start application', error);
  process.exit(1);
});
