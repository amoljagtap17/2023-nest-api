import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email: data.email,
        hash: data.hash,
        refreshToken: null,
      },
    });
  }

  findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  findOneByEmail(email: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  findOneById(id: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  remove(id: string): Promise<User> {
    return this.prismaService.user.delete({ where: { id } });
  }
}
