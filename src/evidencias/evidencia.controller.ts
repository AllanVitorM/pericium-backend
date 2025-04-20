import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EvidenciaService } from 'src/evidencias/evidencia.service';
import { CreateEvidenciaDTO, updateEvidenciaDTO } from 'src/evidencias/evidencia.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import toStream from 'buffer-to-stream';
import { Express } from 'express';

@Controller('evidencias')
export class EvidenciaController {
  constructor(private readonly evidenciaService: EvidenciaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // "file" é o nome do campo no form-data
  async createEvidencia(
    @Body() body: CreateEvidenciaDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.evidenciaService.createEvidencia(body, file);
  }

  @Get()
  findAll() {
    return this.evidenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evidenciaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: updateEvidenciaDTO) {
    return this.evidenciaService.updateEvidencia(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evidenciaService.remove(id);
  }

  private async uploadToCloudinary(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadSteam = cloudinary.uploader.upload_stream(
        { folder: 'evidencias' },
        (error, result) => {
          if (error) {
            return reject(new Error());
          }
          if (!result?.secure_url) {
            return reject(new Error('Falha ao obter Url da imagem'));
          }
          resolve(result.secure_url);
        },
      );
      (toStream(file.buffer) as NodeJS.ReadableStream).pipe(uploadSteam);
    });
  }
}
