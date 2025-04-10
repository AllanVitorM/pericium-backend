import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dbConnection = mongoose.connection;
  dbConnection.on('error', (err) => {
    console.log('Falha ao conectar ao mongoDb', err);
  });

  dbConnection.once('open', () => {
    console.log('Rodou!');
  });

  app.enableCors();
  await app.listen(8000);
}
bootstrap();
