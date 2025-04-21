import { Role } from 'src/common/enums/role.enum';
export interface jwtpayload {
  sub: string;
  cpf: string;
  role: Role;
}
