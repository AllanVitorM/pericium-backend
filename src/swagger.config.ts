// src/swagger.config.ts
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API de Perícia Odontolegal')
    .setDescription('Documentação da API de gestão de casos, laudos e evidências')
    .setVersion('1.0')
    .addBearerAuth() // JWT no header
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
