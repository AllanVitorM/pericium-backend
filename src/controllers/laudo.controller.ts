import{Controller, Post,Body, Get, Param} from '@nestjs/common';
import {LaudoService} from '../service/laudo.service';
import { CreateLaudoDTO } from 'src/DTO/laudo.dto';

@Controller('laudos')
export class LaudoController {
    constructor(private readonly laudoservice: LaudoService) {}

@Post()
async create(@Body()createLaudoDto: CreateLaudoDTO) {
    return this.laudoservice.create(createLaudoDto)
}

@Get()
async findAll(){
    return this.laudoservice.findAll();
}

@Get('evidencia/:id')
async findByEvidencia(@Param('id')id : string) {
    return this.laudoservice.findbyEvidencia(id);
}

}