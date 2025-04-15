export class CreateEvidenciaDTO {
  title: string;
  description?: string;
  local?: string;
  dateRegister: Date;
  imageUrl?: string;
  caseId: string;
}

export class updateEvidenciaDTO {
  local?: string;
  title?: string;
  description?: string;
}
