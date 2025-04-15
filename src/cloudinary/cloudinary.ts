import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

cloudinary.config({
  cloud_name: configService.get('CLOUDNAME'),
  api_key: configService.get('APIKEY'),
  api_secret: configService.get('APISECRET'),
});

export default cloudinary;
