import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import mongoose from 'mongoose';
import { Logger } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dbConnection = mongoose.connection;
  dbConnection.on('error', (err) => {
    console.log ("Falha ao conectar ao mongoDb", err);
  });

  dbConnection.once('open', () =>{
    console.log("Rodou!")
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
