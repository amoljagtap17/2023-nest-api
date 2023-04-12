import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { SkillsModule } from './skills/skills.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, SkillsModule, BlogsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
