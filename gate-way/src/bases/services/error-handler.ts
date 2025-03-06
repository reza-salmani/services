import { GraphQLError, GraphQLErrorOptions } from 'graphql';

export class GraphQlForbiddenException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'FORBIDDEN' },
      }),
    );
  }
}
export class GraphQlBadRequestException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'BAD_REQUEST' },
      }),
    );
  }
}
export class GraphQlUnauthorizedException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'UNAUTHORIZED' },
      }),
    );
  }
}
export class GraphQlNotFoundException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'NOT_FOUND' },
      }),
    );
  }
}
export class GraphQlNotAcceptableException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'NOT_ACCEPTABLE' },
      }),
    );
  }
}
export class GraphQlRequestTimeoutException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'REQUEST_TIMEOUT' },
      }),
    );
  }
}
export class GraphQlConflictException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'CONFLICT' },
      }),
    );
  }
}
export class GraphQlPayloadTooLargeException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'PAYLOAD_TOO_LARGE' },
      }),
    );
  }
}
export class GraphQlUnsupportedMediaTypeException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'UNSUPPORTED_MEDIA_TYPE' },
      }),
    );
  }
}
export class GraphQlInternalServerErrorException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'INTERNAL_SERVER_ERROR' },
      }),
    );
  }
}
export class GraphQlNotImplementedException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'NOT_IMPLEMENTED' },
      }),
    );
  }
}
export class GraphQlMethodNotAllowedException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'METHOD_NOT_ALLOWED' },
      }),
    );
  }
}
export class GraphQlBadGatewayException extends GraphQLError {
  constructor(
    message: string,
    statusCode: number,
    options?: GraphQLErrorOptions,
  ) {
    super(
      message,
      Object.assign(options ?? {}, {
        extensions: { statusCode: statusCode, code: 'BAD_GATEWAY' },
      }),
    );
  }
}
