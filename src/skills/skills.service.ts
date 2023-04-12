import { Injectable } from "@nestjs/common";
import { Skill } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateSkillDto } from "./dto/create-skill.dto";

@Injectable()
export class SkillsService {
  constructor(private readonly prismaService: PrismaService) {}

  async upsert(createSkillDto: CreateSkillDto[]): Promise<void> {
    const skillNames = createSkillDto.map((skill) => skill.name);

    await this.prismaService.skill.deleteMany({
      where: {
        name: { notIn: skillNames },
      },
    });

    const promises = createSkillDto.map(async ({ name, percent, category }) => {
      await this.prismaService.skill.upsert({
        where: {
          name,
        },
        create: {
          name,
          percent,
          category,
        },
        update: {
          name,
          percent,
          category,
        },
      });
    });

    await Promise.all(promises);
  }

  findAll(): Promise<Skill[]> {
    return this.prismaService.skill.findMany();
  }
}
