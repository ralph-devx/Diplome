import * as process from 'node:process';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
// import { NestExpressApplication } from '@nestjs/platform-express';


async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe()); // Настройка валидации
  
  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  });
  
  const config = new DocumentBuilder()
    .setTitle('Дипломная работа')
    .setDescription('Приложение бронирования рабочих мест')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  
  // Раздача статических файлов
  // app.use('/static', express.static(join(__dirname, 'static')));
  // app.useStaticAssets(join(__dirname, 'static'));
  
  app.setGlobalPrefix('api');
  await app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

start();