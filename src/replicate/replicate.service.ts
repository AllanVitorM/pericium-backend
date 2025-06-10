import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ReplicateService {
  private readonly replicateApiKey = process.env.REPLICATE_API_TOKEN;

  async descreverImagem(imageUrl: string): Promise<string> {
    try {
      // Primeiro, tente com modelo pago (salesforce/blip)
      return await this.rodarModeloReplicate(
        'salesforce/blip',
        '2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746',
        {
          image: imageUrl,
          task: 'image_captioning',
        },
      );
    } catch (error) {
      console.warn('⚠️ Modelo pago falhou, tentando fallback gratuito...');

      // Fallback gratuito: moondream2
      return await this.rodarModeloReplicate(
        'lucataco/moondream2',
        '72ccb656353c348c1385df54b237eeb7bfa874bf11486cf0b9473e691b662d31',
        {
          image: imageUrl,
          prompt: 'Describe this image',
        },
      );
    }
  }

  private async rodarModeloReplicate(
    model: string,
    version: string,
    input: any,
  ): Promise<string> {
    const predictionRes = await axios.post(
      `https://api.replicate.com/v1/predictions`,
      {
        version,
        input,
      },
      {
        headers: {
          Authorization: `Token ${this.replicateApiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const prediction = predictionRes.data;

    // Espera até concluir a predição
    let status = prediction.status;
    let output = null;

    while (status !== 'succeeded' && status !== 'failed') {
      const result = await axios.get(prediction.urls.get, {
        headers: {
          Authorization: `Token ${this.replicateApiKey}`,
        },
      });

      status = result.data.status;
      output = result.data.output;

      if (status !== 'succeeded') {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    if (status === 'succeeded') {
      if (Array.isArray(output)) return output[0];
      if (typeof output === 'string') return output;
      return 'Descrição não reconhecida.';
    } else {
      throw new Error('Falha ao gerar descrição da imagem com Replicate');
    }
  }
}
