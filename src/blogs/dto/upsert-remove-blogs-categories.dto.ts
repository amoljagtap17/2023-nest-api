import { IsString } from "class-validator";

export class UpsertRemoveBlogsCategoriesDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
