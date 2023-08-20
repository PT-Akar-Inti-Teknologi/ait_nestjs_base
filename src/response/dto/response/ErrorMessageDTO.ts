import { Builder } from 'builder-pattern';

export class ErrorMessageDTO {
  public readonly field: string = '';

  public readonly message: string = '';

  public readonly code: string = '';

  public static Builder() {
    return Builder(this);
  }
}
