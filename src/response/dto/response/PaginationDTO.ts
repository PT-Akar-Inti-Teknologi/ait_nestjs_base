import { Builder } from 'builder-pattern';

export class PaginationDTO {
  public readonly page: number = 0;

  public readonly total: number;

  public readonly size: number;

  public static Builder() {
    return Builder(this);
  }
}
