/// <reference types="multer" />
import { MessageService } from '../message/message.service';
export declare class ImageValidationService {
    private readonly messageService;
    constructor(messageService: MessageService);
    private errors;
    private filter;
    setFilter(name: string, filtering: string): this;
    validate(req: any): Promise<void>;
    removeSameFieldFilter(field_name: string): void;
    requiredCheck(req: any, field_name: string): Promise<void>;
    requiredMultiple(files: Array<Express.Multer.File>, fieldname?: string): Promise<void>;
}
//# sourceMappingURL=image-validation.service.d.ts.map