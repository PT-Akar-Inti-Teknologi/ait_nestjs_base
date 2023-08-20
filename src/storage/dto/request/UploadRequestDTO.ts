import { Builder } from 'builder-pattern';

export class UploadRequestDTO {
  public buffer: Buffer;
  public path: string;
  public filename: string;
  public static Builder() {
    return Builder(this);
  }
}
