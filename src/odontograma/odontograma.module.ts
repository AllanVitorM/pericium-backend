import { OdontogramaService } from './odontograma.service';
import { OdontogramaController } from './odontograma.controller';
import { Module } from '@nestjs/common';
import { OdontogramaSchema } from './odontograma.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VitimaModule } from 'src/vitima/vitima.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Odontograma', schema: OdontogramaSchema },
    ]),
    VitimaModule,
  ],
  controllers: [OdontogramaController],
  providers: [OdontogramaService],
  exports: [OdontogramaService, MongooseModule],
})
export class OdontogramaModule {}
