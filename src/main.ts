import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

// 🔽 Importações do Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8000;
  const dbConnection = mongoose.connection;
  dbConnection.on('error', (err) => {
    console.log('Falha ao conectar ao mongoDb', err);
  });

  dbConnection.once('open', () => {
    console.log('Rodou!');
  });

  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Swagger')
      .setDescription('Documentação da API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // Disponível em /api
  }

  app.enableCors({
    origin: 'https://pericium.vercel.app',
    credentials: true,
  });

  // 🔽 Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Pericium API')
    .setDescription('Documentação da API REST do Pericium')
    .setVersion('1.0')
    .addBearerAuth() // Se você usa autenticação JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Acesse em http://localhost:8000/api

  await app.listen(port, () => {
    console.log('FUNCIOnaaaaa');
  });
}
bootstrap();
