import { IsEmail, IsString, MinLength } from "class-validator";

export class SignInDto {
  @IsEmail()
  @IsString()
  email: string;

  @MinLength(5)
  @IsString()
  password: string;
}
