import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

// 🔽 Importações do Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  // 🔽 Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Pericium API')
    .setDescription('Documentação da API REST do Pericium')
    .setVersion('1.0')
    .addBearerAuth() // Se você usa autenticação JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Acesse em http://localhost:8000/api

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
