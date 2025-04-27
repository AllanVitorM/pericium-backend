import { Role } from 'src/common/enums/role.enum';

declare module 'express' {
  interface Request {
    user: {
      id: string;
      cpf: string;
      role: Role;
    };
  }
}
