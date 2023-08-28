import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';

import { PaginationDTO } from '../dto/response/pagination.dto';
import { ErrorMessageDTO } from '../dto/response/error-message.dto';
import { ResponseErrorDTO } from '../dto/response/response-error.dto';
import { ListPaginationDTO } from '../dto/response/list-pagination.dto';
import { ResponseSuccessSingleDTO } from '../dto/response/response-success-single.dto';
import { ResponseSuccessCollectionDTO } from '../dto/response/response-success-collection.dto';

@Injectable()
export class ResponseService {
  public responseCode(statusCode: number) {
    return (
      `${process.env.PROJECT_NAME ?? ''}` +
      `-${process.env.SERVICE_NAME ?? ''}` +
      `-${statusCode.toString()}`
    );
  }

  public error(
    statusCode: number,
    messages: ErrorMessageDTO[],
    error: string,
  ): ResponseErrorDTO {
    return ResponseErrorDTO.Builder()
      .response_schema({
        response_code: this.responseCode(statusCode),
        response_message: error,
      })
      .response_output({
        errors: messages,
      })
      .build();
  }

  public successCollection(
    content: any[],
    pagination?: PaginationDTO,
    message = 'Success',
  ): ResponseSuccessCollectionDTO {
    return ResponseSuccessCollectionDTO.Builder()
      .response_schema({
        response_code: this.responseCode(HttpStatus.OK),
        response_message: message,
      })
      .response_output({
        list: ListPaginationDTO.Builder()
          .pagination(
            pagination ??
              PaginationDTO.Builder()
                .size(content.length)
                .total(content.length)
                .build(),
          )
          .content(content)
          .build(),
      })
      .build();
  }

  public success(content: any, message = 'Success'): ResponseSuccessSingleDTO {
    return ResponseSuccessSingleDTO.Builder()
      .response_schema({
        response_code: this.responseCode(HttpStatus.OK),
        response_message: message,
      })
      .response_output({
        detail: content,
      })
      .build();
  }

  public throwError(error: any) {
    if (error.response?.response_schema?.response_code) {
      throw new BadRequestException(error.response);
    }

    if (error.response_schema?.response_code) {
      throw new BadRequestException(error);
    }

    throw new BadRequestException(
      this.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        [ErrorMessageDTO.Builder().message(error.message).build()],
        'Internal Server Error',
      ),
    );
  }
}
