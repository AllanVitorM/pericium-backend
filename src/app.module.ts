import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import Configuration from 'src/config/Configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CaseModule } from './cases/case.module';
import { EvidenciaModule } from './evidencias/evidencia.module';
import { MulterModule } from '@nestjs/platform-express';
import { LaudoModule } from './laudos/laudo.module';
import { RelatorioModule } from './relatorios/relatorio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      load: [Configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URI,
      }),
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    UserModule,
    AuthModule,
    CaseModule,
    EvidenciaModule,
    LaudoModule,
    RelatorioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
