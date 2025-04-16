import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../service/app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';
import Configuration from 'src/config/Configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CaseModule } from './case.module';
import { EvidenciaModule } from './evidencia.module';
import { MulterModule } from '@nestjs/platform-express';
import { LaudoModule } from './laudo.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
