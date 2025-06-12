import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiServiceReport {
  private readonly genAi: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.genAi = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY')!,
    );
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
