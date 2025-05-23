import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule, GraphQLSchemaBuilderModule } from '@nestjs/graphql';
import { GraphQLLoggingMiddleware } from '@utils/logger';
import { join } from 'path';

@Module({
  imports: [
    GraphQLSchemaBuilderModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      csrfPrevention: true,
      hideSchemaDetailsFromClientErrors: true,
      includeStacktraceInErrorResponses: true,
      formatError: (error) => {
        return {
          extensions: error.extensions,
          message: error.message,
          path: error.path,
        };
      },
      introspection: true, // when use production mode it should be true otherwise false
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
})
export class GraphqlModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GraphQLLoggingMiddleware).forRoutes('/graphql');
  }
}
