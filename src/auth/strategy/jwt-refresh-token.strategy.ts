import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AccessToken } from "../interfaces/access-token.interface";
import { RefreshToken } from "../interfaces/refresh-token.interface";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>("JWT_SECRET"),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: AccessToken): RefreshToken {
    const refreshToken = req
      ?.get("authorization")
      ?.replace("Bearer", "")
      .trim();

    if (!refreshToken) throw new ForbiddenException("Refresh token malformed");

    return {
      ...payload,
      refreshToken,
    };
  }
}
