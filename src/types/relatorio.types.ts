export type Odontograma = {
  dentes?: string;
  tipodente?: string;
  observacoes?: string;
  imageUrl?: string;
  vitimaId: string;
};

export type DadosRelatorioCompleto = {
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
    odontogramas: {
      dentes: string;
      tipodente: string;
      observacoes: string;
    }[];
  }[];
};
