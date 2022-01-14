import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('NestApplication');
  app.useStaticAssets('public');
  const port = process.env.PORT || 3000;
  await app.listen(port).then(() => logger.debug(`Running on localhost:${port}`));
}
bootstrap();
