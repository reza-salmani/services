import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { GraphQLError } from 'graphql';
import { join } from 'path';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  log = (message: string, context?: any) => {
    this.saveToFile('log', message, context);
  };

  error(message: string, trace: string, context?: string) {
    this.saveToFile('error', message, context, trace);
  }

  warn(message: string, context?: string) {
    super.warn(message, context);
  }

  debug(message: string, context?: string) {
    super.debug(message, context);
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context);
  }
  saveToFile = (
    type: 'error' | 'log',
    message: string,
    context: any,
    trace: string = '',
  ) => {
    let date = (option: any) =>
      new Date().toLocaleString('fa-IR-u-nu-latn', option);
    let result = `record date & time => ${date({ dateStyle: 'short', timeStyle: 'medium' })} | message => ${message} | context => ${JSON.stringify(context)} | trace => ${trace} \n\n`;

    const pathName = join(
      __dirname,
      type === 'log'
        ? `/loges/log/${date({ year: 'numeric' })}-${date({ month: '2-digit' })}`
        : `/loges/error/${date({ year: 'numeric' })}-${date({ month: '2-digit' })}`,
    );
    if (!existsSync(pathName)) {
      mkdirSync(pathName, { recursive: true });
    }
    let fileName = join(pathName, `${date({ day: 'numeric' })}.txt`);
    if (!existsSync(fileName)) {
      writeFileSync(fileName, result, { encoding: 'utf-8' });
    } else {
      appendFileSync(fileName, result, { encoding: 'utf-8' });
    }
  };
}

@Injectable()
export class GraphQLLoggingMiddleware implements NestMiddleware {
  private readonly logger = new CustomLogger('GraphQL');
  private jwtService = new JwtService();
  use = (req: any, res: any, next: NextFunction) => {
    const now = Date.now();
    const { query, variables } = req.body;
    res.on('finish', () => {
      let userId = '';
      if (req && req.cookies['jwt']) {
        userId = this.jwtService.decode(req.cookies['jwt'].trim()).sub;
      }
      this.logger.log(`Request took ${Date.now() - now}ms`, {
        query,
        variables,
        userId: userId,
      });
    });
    next();
  };
}

@Catch()
export class AllExceptionsToGraphQLErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Transform all exceptions into GraphQL errors
    return new GraphQLError(
      exception.message || 'An unexpected error occurred',
      {
        extensions: {
          code: exception.extensions.code
            ? exception.extensions.code
            : 'INTERNAL_SERVER_ERROR',
          statusCode: exception.extensions.statusCode,
          details: exception.stack,
        },
      },
    );
  }
}
