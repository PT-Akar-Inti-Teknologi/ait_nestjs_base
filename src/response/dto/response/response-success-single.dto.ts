import { Builder } from 'builder-pattern';

import { ResponseDTO } from './response.dto';

export class ResponseSuccessSingleDTO extends ResponseDTO {
  public readonly response_output: {
    detail: any;
  };

  public static Builder() {
    return Builder(this);
  }
}
