import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Laudo, LaudoSchema } from './laudo.schema';
import { LaudoController } from './laudo.controller';
import { LaudoService } from './laudo.service';
import { PdfService } from './shared/pdf.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Laudo.name, schema: LaudoSchema }]),
  ],
  controllers: [LaudoController],
  providers: [LaudoService, PdfService],
  exports: [MongooseModule],
})
export class LaudoModule {}
