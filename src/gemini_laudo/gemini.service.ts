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

  async gerarRelatorioCompleto(dados: {
    caso: {
      titulo: string;
      descricao: string;
      status: string;
      dataAbertura: string;
    };
    evidencias: {
      title: string;
      description: string;
      tipo: string;
      local: string;
      dateRegister: string;
      laudos?: {
        title: string;
        conteudo: string;
      }[];
    }[];
    vitimas: {
      nome: string;
      genero: string;
      documento: string;
      endereco: string;
      etnia: string;
      odontogramas?: {
        dentes: string;
        tipodente: string;
        observacoes: string;
      }[];
    }[];
  }): Promise<string> {
    const model = this.genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Você é um perito forense encarregado de redigir um relatório completo e técnico de um caso investigativo. Abaixo estão os dados estruturados do caso, evidências, laudos e vítimas com seus respectivos odontogramas.

---

Dados do Caso:
- Título: ${dados.caso.titulo}
- Descrição: ${dados.caso.descricao}
- Status: ${dados.caso.status}
- Data de Abertura: ${dados.caso.dataAbertura}

---

Evidências:
${dados.evidencias
  .map(
    (e, i) => `
${i + 1}. Título: ${e.title}
   - Descrição: ${e.description}
   - Tipo: ${e.tipo}
   - Local: ${e.local}
   - Data do Registro: ${e.dateRegister}
   - Laudos:
${
  e.laudos && e.laudos.length > 0
    ? e.laudos
        .map(
          (l, j) => `     ${j + 1}. Título: ${l.title}
        - Conteúdo: ${l.conteudo.slice(0, 300)}...`,
        )
        .join('\n')
    : '     Nenhum laudo disponível.'
}
`,  
  )
  .join('\n')}

---

Vítimas:
${dados.vitimas
  .map(
    (v, i) => `
${i + 1}. Nome: ${v.nome}
   - Gênero: ${v.genero}
   - Documento: ${v.documento}
   - Endereço: ${v.endereco}
   - Etnia: ${v.etnia}
   - Odontogramas:
${
  v.odontogramas && v.odontogramas.length > 0
    ? v.odontogramas
        .map(
          (o, j) => `     ${j + 1}. Dente: ${o.dentes}
        - Tipo: ${o.tipodente}
        - Observações: ${o.observacoes}`,
        )
        .join('\n')
    : '     Nenhum odontograma disponível.'
}
`,
  )
  .join('\n')}

---

Instruções:
Elabore um relatório técnico detalhado e formal com os seguintes tópicos:

1. Introdução: contextualize o caso.
2. Descrição das evidências e análise dos laudos.
3. Perfil das vítimas com observações odontológicas.
4. Considerações finais: destaque achados importantes.
5. Recomendações: próximos passos sugeridos para a investigação.

> Redija de forma clara, formal, técnica e estruturada, como se o relatório fosse entregue a autoridades jurídicas e peritos. Não repita os dados brutos — interprete e integre as informações de forma fluida e objetiva.

Agora, escreva o relatório completo.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const texto = await response.text();

    return texto.trim();
  }
}
