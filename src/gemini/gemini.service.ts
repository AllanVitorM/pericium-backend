import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly genAi: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.genAi = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY')!,
    );
  }

  async gerarLaudo(evidencia: {
    title: string;
    description: string;
    tipo: string;
    local: string;
    dateRegister: string;
    imageUrl?: string;
    descricaoImagem?: string;
  }): Promise<string> {
    const model = this.genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const {
      title,
      description,
      tipo,
      local,
      dateRegister,
      imageUrl,
      descricaoImagem,
    } = evidencia;

    // Mensagem contextual inteligente
    const prompt = `
Você é um perito forense. Com base nas informações a seguir, elabore um único laudo técnico completo, bem estruturado, formal e objetivo.

---

Dados da Evidência:
- Título: ${title}
- Descrição: ${description}
- Tipo: ${tipo}
- Local: ${local}
- Data do Registro: ${dateRegister}
${imageUrl ? `- Link da Imagem: ${imageUrl}` : '- Imagem não fornecida'}
${descricaoImagem ? `- Descrição Automática da Imagem: "${descricaoImagem}"` : ''}

---

Instruções para o laudo:

1. Introdução: contextualize a evidência com linguagem técnica.
2. Metodologia: explique como a análise será conduzida, mesmo que limitada às informações fornecidas.
3. Análise:
   - Caso haja imagem: destaque o que pode ser inferido com base na descrição automática da imagem.
4. Conclusão: sintetize os achados técnicos.
5. Recomendações: indique próximos passos ou análises complementares, se necessário.

> O laudo deve conter títulos e subtítulos, evitar repetições, ser conciso e direto. Evite redundância com os dados fornecidos no início. Redija como se fosse entregue a autoridades.

Escreva o laudo agora.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const texto = await response.text();

    return texto.trim();
  }
}
