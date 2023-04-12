import { SkillCategory } from "@prisma/client";
import { IsEnum, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percent: number;

  @IsEnum(SkillCategory)
  category: SkillCategory;
}
