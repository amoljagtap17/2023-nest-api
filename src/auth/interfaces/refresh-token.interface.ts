import { AccessToken } from "./access-token.interface";

export interface RefreshToken extends AccessToken {
  refreshToken: string;
}
