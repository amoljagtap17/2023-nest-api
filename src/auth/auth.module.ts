import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import jwtConfig from "./config/jwt.config";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { BcryptService } from "./hashing/bcrypt.service";
import { HashingService } from "./hashing/hashing.service";
import { JwtAccessTokenStrategy } from "./strategy/jwt-access-token.strategy";
import { JwtRefreshTokenStrategy } from "./strategy/jwt-refresh-token.strategy";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
