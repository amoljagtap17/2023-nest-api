import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const configService = app.get(ConfigService);
  const enableSwagger = configService.get<string>("ENABLE_SWAGGER");

  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // disableErrorMessages: true,
      whitelist: true,
    }),
  );

  app.setGlobalPrefix("api");

  if (enableSwagger === "1") {
    const config = new DocumentBuilder()
      .setTitle("Your Website Dot Com - API")
      .setDescription("Personal Website API")
      .setVersion("1.0")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("swagger", app, document);
  }

  await app.listen(4000);
}
bootstrap();
