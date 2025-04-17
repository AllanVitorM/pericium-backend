import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LaudoSchema } from "../schemas/laudo.schema";
import { LaudoController } from "../controllers/laudo.controller";
import { LaudoService } from "../service/laudo.service";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Laudo', schema: LaudoSchema}])],
    controllers: [LaudoController],
    providers: [LaudoService],
})
export class LaudoModule {}

