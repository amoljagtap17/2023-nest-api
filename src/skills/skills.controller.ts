import { Body, Controller, Get, Post } from "@nestjs/common";
import { Public } from "src/auth/decorators/public.decorator";
import { CreateSkillDto } from "./dto/create-skill.dto";
import { SkillsService } from "./skills.service";

@Controller("skills")
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Body() createSkillDto: CreateSkillDto[]) {
    return this.skillsService.upsert(createSkillDto);
  }
  @Public()
  @Get()
  findAll() {
    return this.skillsService.findAll();
  }
}
