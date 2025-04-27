import { Module } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // importa para conseguir ler .env
  providers: [
    {
      provide: 'CLOUDINARY',
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get<string>('CLOUDNAME'),
          api_key: configService.get<string>('APIKEY'),
          api_secret: configService.get<string>('APISECRET'),
        });
        return cloudinary;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['CLOUDINARY'],
})
export class CloudinaryModule {}
