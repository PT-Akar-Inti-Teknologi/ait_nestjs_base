import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageService } from '../message/message.service';

@Injectable()
export class ImageValidationService {
  constructor(private readonly messageService: MessageService) {}

  private errors: any[] = [];
  private filter: Array<{ name: string; filtering: string }> = [];

  setFilter(name: string, filtering: string) {
    this.filter.push({
      name,
      filtering,
    });
    return this;
  }

  async validate(req: any) {
    if (req.fileValidationError) {
      req.fileValidationError.map((error) => {
        error.constraint = this.messageService.get(error.constraint);
        this.errors.push(error);
        this.removeSameFieldFilter(error.property);
        return error;
      });
    }
    this.filter.forEach(async (element) => {
      if (element.filtering == 'required') {
        await this.requiredCheck(req, element.name);
      }
    });
    this.filter = [];

    if (this.errors && this.errors.length > 0) {
      const all_errors = [...this.errors];
      this.errors.splice(0, this.errors.length);
      this.filter.splice(0, this.filter.length);
      throw new BadRequestException(all_errors);
    }
  }

  removeSameFieldFilter(field_name: string) {
    for (let i = 0; i < this.filter.length; i++) {
      if (this.filter[i].name == field_name) {
        this.filter.splice(i, 1);
      }
    }
  }

  async requiredCheck(req: any, field_name: string) {
    if (req.file) {
      await this.requiredMultiple([req.file], field_name);
    } else if (req.files) {
      await this.requiredMultiple(req.files, field_name);
    } else {
      const error = {
        value: '',
        property: field_name ?? 'file',
        constraint: [this.messageService.get('file.error.is_required')],
      };
      this.errors.push(error);
    }
  }

  async requiredMultiple(
    files: Array<Express.Multer.File>,
    fieldname?: string,
  ) {
    let found = 0;
    for (const file of files) {
      if (file.fieldname == fieldname) {
        found += 1;
      }
    }
    if (!found) {
      const error = {
        value: '',
        property: fieldname ?? 'file',
        constraint: [this.messageService.get('file.error.is_required')],
      };
      this.errors.push(error);
    }
  }
}
