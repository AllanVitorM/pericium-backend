import { OdontogramaService } from './odontograma.service';
import { OdontogramaController } from './odontograma.controller';
import { Module } from '@nestjs/common';
import { OdontogramaSchema } from './odontograma.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Odontograma', schema: OdontogramaSchema },
    ]),
  ],
  controllers: [OdontogramaController],
  providers: [OdontogramaService],
  exports: [OdontogramaService, MongooseModule],
})
export class OdontogramaModule {}
