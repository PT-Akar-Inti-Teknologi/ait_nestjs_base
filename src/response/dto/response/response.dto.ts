import { Builder } from 'builder-pattern';

export class ResponseDTO {
  public readonly response_schema: {
    readonly response_code: string;
    readonly response_message: string;
  };

  public readonly response_output: any;

  public static Builder() {
    return Builder(this);
  }
}
