export class CreateRelatorioDTO {
    title: string;
    descricao: string;
    pdfUrl?: string;
    caseId: string;
    userId: string;
  }
  
  export class UpdateRelatorioDTO {
    title?: string;
    descricao?: string;
    pdfUrl?: string;
  }
  
  export class AssinarRelatorioDTO {
    peritoId: string;
  }
  