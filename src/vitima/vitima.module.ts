import { VitimaService } from './vitima.service';
import { VitimaController } from './vitima.controller';
import { Module } from '@nestjs/common';
import { VitimaSchema } from './vitima.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vitima', schema: VitimaSchema }]),
  ],
  controllers: [VitimaController],
  providers: [VitimaService],
  exports: [VitimaService, MongooseModule],
})
export class VitimaModule {}
