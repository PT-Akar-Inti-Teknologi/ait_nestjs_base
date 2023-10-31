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
exports.MainPagingDTO = void 0;
const class_transformer_1 = require("class-transformer");
const i18n_class_validator_1 = require("../../i18n-class-validator");
class MainPagingDTO {
    constructor() {
        this.page = 0;
        this.size = 10;
        this.search = '';
    }
}
__decorate([
    (0, i18n_class_validator_1.IsOptional)(),
    (0, i18n_class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Object)
], MainPagingDTO.prototype, "page", void 0);
__decorate([
    (0, i18n_class_validator_1.IsOptional)(),
    (0, i18n_class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Object)
], MainPagingDTO.prototype, "size", void 0);
__decorate([
    (0, i18n_class_validator_1.IsOptional)(),
    (0, i18n_class_validator_1.IsString)(),
    __metadata("design:type", Object)
], MainPagingDTO.prototype, "search", void 0);
__decorate([
    (0, i18n_class_validator_1.IsOptional)(),
    (0, i18n_class_validator_1.IsString)(),
    __metadata("design:type", String)
], MainPagingDTO.prototype, "sort", void 0);
__decorate([
    (0, i18n_class_validator_1.IsOptional)(),
    (0, i18n_class_validator_1.IsString)(),
    (0, i18n_class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], MainPagingDTO.prototype, "order", void 0);
exports.MainPagingDTO = MainPagingDTO;
//# sourceMappingURL=main-paging.dto.js.map