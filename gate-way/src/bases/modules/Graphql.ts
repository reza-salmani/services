import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule, GraphQLSchemaBuilderModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    GraphQLSchemaBuilderModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      formatError: (error) => {
        const graphQLFormattedError = {
          message: error.message,
          extensions: {
            code: error.extensions.code,
            statusCode: error.extensions.statusCode,
            description: error.extensions.description,
            cause: error.extensions.cause,
          },
        };
        return graphQLFormattedError;
      },
      introspection: true, // when use production mode it should be true otherwise false
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
})
export class GraphqlModule {}
