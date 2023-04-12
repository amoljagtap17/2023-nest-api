import { Injectable } from "@nestjs/common";
import { Blog, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UpsertRemoveBlogsCategoriesDto } from "./dto/upsert-remove-blogs-categories.dto";

@Injectable()
export class BlogsService {
  constructor(private readonly prismaService: PrismaService) {}

  async upsertRemoveBlogsCategories(
    upsertRemoveBlogsCategoriesDto: UpsertRemoveBlogsCategoriesDto[],
  ): Promise<void> {
    const blogCategoryNames = upsertRemoveBlogsCategoriesDto.map(
      (blogCategory) => blogCategory.name,
    );

    await this.prismaService.blogCategory.deleteMany({
      where: {
        name: { notIn: blogCategoryNames },
      },
    });

    const promises = upsertRemoveBlogsCategoriesDto.map(
      async ({ name, description }) => {
        await this.prismaService.blogCategory.upsert({
          where: {
            name,
          },
          create: {
            name,
            description,
          },
          update: {
            name,
            description,
          },
        });
      },
    );

    await Promise.all(promises);
  }

  async findAllBlogsCategories() {
    return this.prismaService.blogCategory.findMany();
  }

  createDraft(data: Prisma.BlogCreateInput): Promise<Blog> {
    return this.prismaService.blog.create({
      data,
    });
  }

  async getBlogs(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BlogWhereUniqueInput;
    where?: Prisma.BlogWhereInput;
    orderBy?: Prisma.BlogOrderByWithRelationInput;
  }): Promise<Blog[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prismaService.blog.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        category: true,
      },
    });
  }

  getBlogBySlug(slug: string): Promise<Blog> {
    return this.prismaService.blog.findFirst({
      where: { slug, isPublished: true },
      include: { category: true },
    });
  }

  updateBlog(params: {
    where: Prisma.BlogWhereUniqueInput;
    data: Prisma.BlogUncheckedUpdateInput;
  }): Promise<Blog> {
    const { data, where } = params;

    return this.prismaService.blog.update({
      data,
      where,
    });
  }

  deleteBlog(where: Prisma.BlogWhereUniqueInput): Promise<Blog> {
    return this.prismaService.blog.delete({ where });
  }
}
