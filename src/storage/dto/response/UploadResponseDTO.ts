import { Builder } from 'builder-pattern';

export class UploadResponseDTO {
  public tag: string;
  public key: string;
  public bucket: string;
  public static Builder() {
    return Builder(this);
  }
}
