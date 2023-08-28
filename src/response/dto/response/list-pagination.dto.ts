import { Builder } from 'builder-pattern';

import { PaginationDTO } from './pagination.dto';

export class ListPaginationDTO {
  public readonly pagination: PaginationDTO;
  public readonly content: any[];

  public static Builder() {
    return Builder(this);
  }
}
