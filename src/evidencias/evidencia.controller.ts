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
  UseGuards,
} from '@nestjs/common';
import { EvidenciaService } from 'src/evidencias/evidencia.service';
import {
  CreateEvidenciaDTO,
  updateEvidenciaDTO,
} from 'src/evidencias/evidencia.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import toStream from 'buffer-to-stream';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';

// 🔽 Swagger
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Evidências')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('evidencias')
export class EvidenciaController {
  constructor(private readonly evidenciaService: EvidenciaService) {}

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Post('createevidence')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Criar nova evidência com upload de arquivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados da evidência + imagem',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        descricao: { type: 'string' },
        tipo: { type: 'string' },
        casoId: { type: 'string' },
      },
      required: ['file', 'descricao', 'tipo', 'casoId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Evidência criada com sucesso' })
  async createEvidencia(
    @Body() body: CreateEvidenciaDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.evidenciaService.createEvidencia(body, file);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get()
  @ApiOperation({ summary: 'Listar todas as evidências' })
  findAll() {
    return this.evidenciaService.findAll();
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar evidência por ID' })
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: string) {
    return this.evidenciaService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Get('bycase/:caseId')
  @ApiOperation({ summary: 'Listar evidências por ID do caso' })
  @ApiParam({ name: 'caseId', required: true })
  findByCaseId(@Param('caseId') caseId: string) {
    return this.evidenciaService.findByCaseId(caseId);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Patch('update/:id')
  @ApiOperation({ summary: 'Atualizar dados da evidência' })
  @ApiParam({ name: 'id', required: true })
  update(@Param('id') id: string, @Body() dto: updateEvidenciaDTO) {
    return this.evidenciaService.updateEvidencia(id, dto);
  }

  @Roles(Role.ADMIN, Role.PERITO, Role.ASSISTENTE)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover evidência por ID' })
  @ApiParam({ name: 'id', required: true })
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
          if (error) return reject(new Error());
          if (!result?.secure_url) {
            return reject(new Error('Falha ao obter URL da imagem'));
          }
          resolve(result.secure_url);
        },
      );
      (toStream(file.buffer) as NodeJS.ReadableStream).pipe(uploadSteam);
    });
  }
}
