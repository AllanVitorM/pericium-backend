// types/AuthenticatedRequest.ts
import { Request } from 'express';
import { Role } from 'src/common/enums/role.enum';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    role: Role;
  };
}
