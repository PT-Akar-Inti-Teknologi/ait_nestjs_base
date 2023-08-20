import { Builder } from 'builder-pattern';

import { ResponseDTO } from './ResponseDTO';
import { ErrorMessageDTO } from './ErrorMessageDTO';

export class ResponseErrorDTO extends ResponseDTO {
  public readonly response_output: {
    errors: ErrorMessageDTO[];
  };

  public static Builder() {
    return Builder(this);
  }
}
