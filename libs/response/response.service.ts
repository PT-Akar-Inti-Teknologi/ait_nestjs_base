import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ErrorMessageInterface,
  ResponseErrorInterface,
  ResponseSuccessCollectionInterface,
  PaginationInterface,
  ResponseSuccessPaginationInterface,
  ResponseSuccessSingleInterface,
  ResponseServiceConfig,
} from './response.interface';

@Injectable()
export class ResponseService {
  responseCode(statusCode: number) {
    return statusCode.toString();
  }

  error(
    statusCode: number,
    messages: ErrorMessageInterface[],
    error: string,
  ): ResponseErrorInterface {
    return {
      response_schema: {
        response_code: this.responseCode(statusCode),
        response_message: error,
      },
      response_output: {
        errors: messages,
      },
    };
  }

  successCollection(
    content: any[],
    pagination?: PaginationInterface,
    message?: string,
  ): ResponseSuccessCollectionInterface | ResponseSuccessPaginationInterface {
    if (!pagination) {
      pagination = null;
    }
    if (!message) {
      message = 'Success';
    }
    return {
      response_schema: {
        response_code: this.responseCode(HttpStatus.OK),
        response_message: message,
      },
      response_output: {
        list: {
          pagination,
          content,
        },
      },
    };
  }

  success(content: any, message?: string): ResponseSuccessSingleInterface {
    if (!message) {
      message = 'Success';
    }
    return {
      response_schema: {
        response_code: this.responseCode(HttpStatus.OK),
        response_message: message,
      },
      response_output: {
        detail: content,
      },
    };
  }

  throwError(error: any) {
    if (error.response?.response_schema?.response_code) {
      throw new BadRequestException(error.response);
    }
    if (error.response_schema?.response_code) {
      throw new BadRequestException(error);
    }
    const errorMessage: ErrorMessageInterface = {
      field: '',
      message: error.message,
      code: '',
    };
    throw new BadRequestException(
      this.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        [errorMessage],
        'Internal Server Error',
      ),
    );
  }
}

@Injectable()
export class ResponseServiceImpl extends ResponseService {
  constructor(private readonly config: ResponseServiceConfig) {
    super();
  }

  responseCode(statusCode: number) {
    return `${this.config.projectName}-${
      this.config.serviceName
    }-${statusCode.toString()}`;
  }
}
