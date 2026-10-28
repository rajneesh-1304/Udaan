import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use('/uploads', express.static('uploads'));
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  // dataSource.initialize()
  // .then(() => console.log("Data Source has been initialized!"))
  // .catch((err) => console.error("Error during Data Source initialization", err));
  console.log('Listening on port 3001');
  await app.listen(3001);
}
bootstrap();
