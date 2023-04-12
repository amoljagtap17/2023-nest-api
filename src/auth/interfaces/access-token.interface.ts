import { Role } from "@prisma/client";

export interface AccessToken {
  sub: string;
  role: Role;
}
