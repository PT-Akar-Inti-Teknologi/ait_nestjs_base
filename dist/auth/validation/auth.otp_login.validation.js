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
exports.AuthOtpLoginValidation = void 0;
const class_validator_1 = require("class-validator");
class AuthOtpLoginValidation {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.Length)(10, 15),
    __metadata("design:type", String)
], AuthOtpLoginValidation.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AuthOtpLoginValidation.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuthOtpLoginValidation.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(4, 4),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], AuthOtpLoginValidation.prototype, "otp_code", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AuthOtpLoginValidation.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['customer', 'merchant', 'admin']),
    __metadata("design:type", String)
], AuthOtpLoginValidation.prototype, "user_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['group', 'merchant', 'store'])
    // @IsIn(['brand', 'corporate', 'store'])
    ,
    __metadata("design:type", String)
], AuthOtpLoginValidation.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.Length)(10, 15),
    __metadata("design:type", String)
], AuthOtpLoginValidation.prototype, "phone_new", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], AuthOtpLoginValidation.prototype, "created_at", void 0);
exports.AuthOtpLoginValidation = AuthOtpLoginValidation;
//# sourceMappingURL=auth.otp_login.validation.js.map