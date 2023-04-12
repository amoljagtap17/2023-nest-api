import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Prisma, Role } from "@prisma/client";
import { UsersService } from "src/users/users.service";
import jwtConfig from "./config/jwt.config";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { HashingService } from "./hashing/hashing.service";
import { AccessToken } from "./interfaces/access-token.interface";
import { Tokens } from "./interfaces/tokens.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{
    id: string;
    role: Role;
  }> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException("User does not exists");
    }

    const isEqual = await this.hashingService.compare(password, user.hash);

    if (!isEqual) {
      throw new UnauthorizedException("Password does not match");
    }

    return { id: user.id, role: user.role };
  }

  async register(data: SignUpDto): Promise<{
    email: string;
  }> {
    try {
      const hash = await this.hashingService.hash(data.password);

      const newUser = await this.usersService.create({
        email: data.email,
        hash,
      });

      return { email: newUser.email };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new ForbiddenException("Email already exists!");
        }
      }

      throw err;
    }
  }

  async login(user: { id: string; role: Role }): Promise<Tokens> {
    const tokens = await this.generateTokens(user);

    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(user: { sub: string; role: Role }): Promise<boolean> {
    await this.usersService.update(user.sub, { refreshToken: null });

    return true;
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = await this.hashingService.hash(refreshToken);

    await this.usersService.update(userId, { refreshToken: hash });
  }

  async generateTokens(user: { id: string; role: Role }): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<AccessToken>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          role: user.role,
        },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<AccessToken, "sub">
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.usersService.findOneById(sub);

      if (!user) {
        throw new UnauthorizedException("User does not exists");
      }

      const token = refreshTokenDto.refreshToken;
      const existingHash = user.refreshToken;

      const isEqual = await this.hashingService.compare(token, existingHash);

      if (!isEqual) {
        throw new UnauthorizedException("Invalid Refresh Token");
      }

      const tokens = await this.generateTokens(user);

      await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

      return tokens;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
