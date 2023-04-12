import { Role } from "@prisma/client";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  hash?: string;

  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;

  @IsString()
  @IsOptional()
  refreshToken?: string | null;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
