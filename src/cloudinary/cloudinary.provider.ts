import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
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
};
