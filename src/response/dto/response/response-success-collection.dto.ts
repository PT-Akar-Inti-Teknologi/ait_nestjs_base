import { Builder } from 'builder-pattern';

import { ResponseDTO } from './response.dto';
import { ListPaginationDTO } from './list-pagination.dto';

export class ResponseSuccessCollectionDTO extends ResponseDTO {
  public readonly response_output: {
    list: ListPaginationDTO;
  };

  public static Builder() {
    return Builder(this);
  }
}
