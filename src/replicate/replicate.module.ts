// replicate.module.ts
import { Module } from '@nestjs/common';
import { ReplicateService } from './replicate.service';

@Module({
  providers: [ReplicateService],
  exports: [ReplicateService], // <- necessário para outros módulos usarem
})
export class ReplicateModule {}
