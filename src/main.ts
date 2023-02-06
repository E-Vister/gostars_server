import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle(`GoStars API`)
    .setDescription(
      `Server for 'gostars'(gitlab.12devs.com/training/2023_trainee/bausiuk_gostars_frontend)`,
    )
    .setVersion(`1.0.0`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
bootstrap();
