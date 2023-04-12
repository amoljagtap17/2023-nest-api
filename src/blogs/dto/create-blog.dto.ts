import { IsBoolean, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  excerpt: string;

  @IsString()
  content: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  ratings: number;

  @IsString()
  blogCategoryId: string;

  @IsBoolean()
  isPublished: boolean;
}
