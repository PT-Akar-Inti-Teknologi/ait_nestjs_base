import { Builder } from 'builder-pattern';

import { ResponseDTO } from './response.dto';
import { ErrorMessageDTO } from './error-message.dto';

export class ResponseErrorDTO extends ResponseDTO {
  public readonly response_output: {
    errors: ErrorMessageDTO[];
  };

  public static Builder() {
    return Builder(this);
  }
}
