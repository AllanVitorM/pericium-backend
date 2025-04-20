export class CreateLaudoDTO {
  title: string;
  descricao: string;
  pdfUrl?: string;
  evidenciaId: string;
  userId: string;
}

export class UpdateLaudoDTO {
  title?: string;
  descricao?: string;
  pdfUrl?: string;
}

export class AssinarLaudoDTO {
  peritoId: string;
}
