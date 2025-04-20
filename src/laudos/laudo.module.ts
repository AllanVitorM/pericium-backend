import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LaudoSchema } from './laudo.schema';
import { LaudoController } from './laudo.controller';
import { LaudoService } from './laudo.service';
import { PdfService } from './shared/pdf.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Laudo', schema: LaudoSchema }]),
  ],
  controllers: [LaudoController],
  providers: [LaudoService, PdfService],
})
export class LaudoModule {}
