import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger.config'; // ✅ aqui

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dbConnection = mongoose.connection;
  dbConnection.on('error', (err) => {
    console.log('Falha ao conectar ao mongoDb', err);
  });

  dbConnection.once('open', () => {
    console.log('Rodou!');
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  setupSwagger(app); // ✅ aqui

  await app.listen(8000);
}
bootstrap();
