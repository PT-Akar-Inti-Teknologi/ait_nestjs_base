import { FileValidator } from '@nestjs/common';
import { randomUUID } from 'crypto';

export abstract class LoyaltyFileValidator<
  T = Record<string, any>,
> extends FileValidator<T> {
  private _id = randomUUID();

  public abstract type: string;

  get id() {
    return this.type + this._id;
  }

  buildErrorMessage(): string {
    return this.id;
  }

  buildTranslationKey(): string {
    return `validation_custom.${this.type}`;
  }

  abstract get constraints(): any[];
}

export interface FileMaxSizeValidatorProp {
  maxSize: number;
  maxSizeMsg: string;
}

export class FileMaxSizeValidator extends LoyaltyFileValidator<FileMaxSizeValidatorProp> {
  public type = 'FILE_MAX_SIZE';

  get constraints(): any[] {
    return [this.validationOptions.maxSizeMsg];
  }

  isValid(file) {
    if (!this.validationOptions || !file) {
      return true;
    }
    console.log(file.size);
    return 'size' in file && file.size < this.validationOptions.maxSize;
  }
}

export class LoyaltyFileTypeValidator extends LoyaltyFileValidator<{
  types: string[];
}> {
  public type = 'FILE_TYPE';

  constructor(types: string[]) {
    super({ types });
  }

  get constraints(): any[] {
    return [this.validationOptions.types];
  }

  isValid(file) {
    return (
      !!file &&
      'mimetype' in file &&
      !!this.validationOptions.types.includes(file.mimetype)
    );
  }
}

export class FileMaxSizeValidator1MB extends FileMaxSizeValidator {
  constructor() {
    super({
      maxSize: 1024 * 1024,
      maxSizeMsg: '1MB',
    });
  }
}
