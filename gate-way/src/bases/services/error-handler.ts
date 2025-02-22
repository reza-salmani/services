import { HttpStatus } from '@nestjs/common';
import { Consts } from '@src/Utils/consts';
import { GraphQLError } from 'graphql';

export class ForbiddenException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.ForbiddenMessage, {
      extensions: {
        statusCode: HttpStatus.FORBIDDEN,
        description: description,
        cause: cause,
      },
    });
  }
}
export class BadRequestException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.badRequestMessage, {
      extensions: {
        statusCode: HttpStatus.BAD_REQUEST,
        description: description,
        cause: cause,
      },
    });
  }
}
export class UnauthorizedException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.unAuthorized, {
      extensions: {
        statusCode: HttpStatus.UNAUTHORIZED,
        description: description,
        cause: cause,
      },
    });
  }
}
export class NotFoundException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.DataNotFound, {
      extensions: {
        statusCode: HttpStatus.NOT_FOUND,
        cause: cause,
        description: description,
      },
    });
  }
}
export class NotAcceptableException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.notAcceptableMessage, {
      extensions: {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        description: description,
        cause: cause,
      },
    });
  }
}
export class RequestTimeoutException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.requestTimeoutMessage, {
      extensions: {
        statusCode: HttpStatus.REQUEST_TIMEOUT,
        description: description,
        cause: cause,
      },
    });
  }
}
export class ConflictException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.conflictMessage, {
      extensions: {
        statusCode: HttpStatus.CONFLICT,
        description: description,
        cause: cause,
      },
    });
  }
}
export class PayloadTooLargeException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.payloadTooLargeMessage, {
      extensions: {
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        description: description,
        cause: cause,
      },
    });
  }
}
export class UnsupportedMediaTypeException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.unsupportedMediaTypeMessage, {
      extensions: {
        statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        description: description,
        cause: cause,
      },
    });
  }
}
export class InternalServerErrorException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.internalServerMessage, {
      extensions: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        description: description,
        cause: cause,
      },
    });
  }
}
export class NotImplementedException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.notImplementedException, {
      extensions: {
        statusCode: HttpStatus.NOT_IMPLEMENTED,
        description: description,
        cause: cause,
      },
    });
  }
}
export class MethodNotAllowedException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.methodNotAllowedMessage, {
      extensions: {
        statusCode: HttpStatus.METHOD_NOT_ALLOWED,
        description: description,
        cause: cause,
      },
    });
  }
}
export class BadGatewayException extends GraphQLError {
  constructor(cause: Error = null, description: string = null) {
    super(Consts.badGatewayMessage, {
      extensions: {
        statusCode: HttpStatus.BAD_GATEWAY,
        description: description,
        cause: cause,
      },
    });
  }
}
