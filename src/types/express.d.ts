import { Role } from 'src/common/enums/role.enum';

declare module 'express' {
  interface Request {
    user?: {
      userId: string;
      cpf: string;
      role: Role;
    };
  }
}
