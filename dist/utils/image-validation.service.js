"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageValidationService = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("../message/message.service");
let ImageValidationService = class ImageValidationService {
    constructor(messageService) {
        this.messageService = messageService;
        this.errors = [];
        this.filter = [];
    }
    setFilter(name, filtering) {
        this.filter.push({
            name,
            filtering,
        });
        return this;
    }
    async validate(req) {
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
            throw new common_1.BadRequestException(all_errors);
        }
    }
    removeSameFieldFilter(field_name) {
        for (let i = 0; i < this.filter.length; i++) {
            if (this.filter[i].name == field_name) {
                this.filter.splice(i, 1);
            }
        }
    }
    async requiredCheck(req, field_name) {
        if (req.file) {
            await this.requiredMultiple([req.file], field_name);
        }
        else if (req.files) {
            await this.requiredMultiple(req.files, field_name);
        }
        else {
            const error = {
                value: '',
                property: field_name !== null && field_name !== void 0 ? field_name : 'file',
                constraint: [this.messageService.get('file.error.is_required')],
            };
            this.errors.push(error);
        }
    }
    async requiredMultiple(files, fieldname) {
        let found = 0;
        for (const file of files) {
            if (file.fieldname == fieldname) {
                found += 1;
            }
        }
        if (!found) {
            const error = {
                value: '',
                property: fieldname !== null && fieldname !== void 0 ? fieldname : 'file',
                constraint: [this.messageService.get('file.error.is_required')],
            };
            this.errors.push(error);
        }
    }
};
ImageValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], ImageValidationService);
exports.ImageValidationService = ImageValidationService;
//# sourceMappingURL=image-validation.service.js.map