import { CaseService } from './case.service';
import { CaseController } from './case.controller';
import { Module } from '@nestjs/common';
import { CaseSchema } from './case.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Case', schema: CaseSchema }])],
  controllers: [CaseController],
  providers: [CaseService],
  exports: [CaseService, MongooseModule],
})
export class CaseModule {}
