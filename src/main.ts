import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);

  logger.log(`==================================================================`);
  logger.log(`🚀 Digital Card Specialist API is running on: http://localhost:${port}`);
  logger.log(`🎮 Apollo GraphQL Sandbox is available at:  http://localhost:${port}/graphql`);
  logger.log(`==================================================================`);
}

bootstrap();
