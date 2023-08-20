import { Builder } from 'builder-pattern';

import { ResponseDTO } from './ResponseDTO';
import { PaginationDTO } from './PaginationDTO';

export class ResponseSuccessCollectionDTO<E> extends ResponseDTO {
  public readonly response_output: {
    list: {
      pagination: PaginationDTO;
      content: E[];
    };
  };

  public static Builder() {
    return Builder(this);
  }
}
