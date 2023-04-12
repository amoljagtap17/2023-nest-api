import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Blog as BlogModel } from "@prisma/client";
import slugify from "slugify";
import { Public } from "src/auth/decorators/public.decorator";
import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { UpsertRemoveBlogsCategoriesDto } from "./dto/upsert-remove-blogs-categories.dto";

@Controller("blogs")
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post("categories")
  upsertRemoveBlogsCategories(
    @Body() upsertRemoveBlogsCategoriesDto: UpsertRemoveBlogsCategoriesDto[],
  ) {
    return this.blogsService.upsertRemoveBlogsCategories(
      upsertRemoveBlogsCategoriesDto,
    );
  }

  @Public()
  @Get("categories")
  findAllBlogsCategories() {
    return this.blogsService.findAllBlogsCategories();
  }

  @Post()
  createDraft(@Body() createBlogDto: CreateBlogDto): Promise<BlogModel> {
    const { title, excerpt, content, ratings, isPublished, blogCategoryId } =
      createBlogDto;

    const slug = slugify(title, { lower: true, strict: true });

    return this.blogsService.createDraft({
      slug,
      title,
      excerpt,
      content,
      ratings,
      isPublished,
      category: {
        connect: { id: blogCategoryId },
      },
    });
  }

  @Get()
  getAllBlogs(): Promise<BlogModel[]> {
    return this.blogsService.getBlogs({});
  }

  @Public()
  @Get("published")
  getPublishedBlogs(): Promise<BlogModel[]> {
    return this.blogsService.getBlogs({
      where: {
        isPublished: true,
      },
    });
  }

  @Public()
  @Get(":slug")
  async getBlogBySlug(@Param("slug") slug: string): Promise<BlogModel> {
    const blog = await this.blogsService.getBlogBySlug(slug);

    if (!blog) {
      throw new NotFoundException("Blog Not Found");
    }

    return blog;
  }

  @Patch(":id")
  updateBlog(
    @Param("id") id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogModel> {
    return this.blogsService.updateBlog({ where: { id }, data: updateBlogDto });
  }

  @Delete(":id")
  deleteBlog(@Param("id") id: string): Promise<BlogModel> {
    return this.blogsService.deleteBlog({ id });
  }
}
