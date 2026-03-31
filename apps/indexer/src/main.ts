import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
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

  const logger = new Logger('bootstrap');
  logger.log(`Indexer API listening on port ${port}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('bootstrap');
  logger.error('Failed to start application', error);
  process.exit(1);
});
