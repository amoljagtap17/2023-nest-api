import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Tokens } from "./interfaces/tokens.interface";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  register(@Body() signUpDto: SignUpDto): Promise<{
    email: string;
  }> {
    return this.authService.register(signUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request): Promise<Tokens> {
    return this.authService.login(req.user as { id: string; role: Role });
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request): Promise<boolean> {
    return this.authService.logout(req.user as { sub: string; role: Role });
  }

  @Post("refresh-tokens")
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Get("profile")
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
