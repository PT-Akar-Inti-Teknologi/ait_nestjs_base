import { Builder } from 'builder-pattern';

export class UploadResponseDto {
  public tag: string;
  public key: string;
  public bucket: string;
  public static Builder() {
    return Builder(this);
  }
}
