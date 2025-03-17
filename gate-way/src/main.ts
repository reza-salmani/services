import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { printSchema } from 'graphql/utilities';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import * as cookieParser from 'cookie-parser';
import { CustomLogger } from './utils/logger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    // abortOnError: false,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3001'],
  });
  app.useLogger(app.get(CustomLogger));
  // app.useGlobalInterceptors(app.get(TimingInterceptor));
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
  if (process.env.NODE_ENV === 'production') {
    const { schema } = app.get(GraphQLSchemaHost);
    writeFileSync(join(process.cwd(), `/src/schema.gql`), printSchema(schema));
  }
}
bootstrap().catch((err) => {
  writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
  process.exit(1);
});
