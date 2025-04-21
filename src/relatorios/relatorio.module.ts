import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RelatorioSchema } from './relatorio.schema';
import { RelatorioController } from './relatorio.controller';
import { RelatorioService } from './relatorio.service';
import { PdfService } from './shared/pdf.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Relatorio', schema: RelatorioSchema }]),
  ],
  controllers: [RelatorioController],
  providers: [RelatorioService, PdfService],
})
export class RelatorioModule {}
