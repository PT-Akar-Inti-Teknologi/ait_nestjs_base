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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionDocument = exports.EnumMainBannersStatus = void 0;
const typeorm_1 = require("typeorm");
var EnumMainBannersStatus;
(function (EnumMainBannersStatus) {
    EnumMainBannersStatus["ACTIVE"] = "ACTIVE";
    EnumMainBannersStatus["INACTIVE"] = "INACTIVE";
    EnumMainBannersStatus["FINISHED"] = "FINISHED";
})(EnumMainBannersStatus || (exports.EnumMainBannersStatus = EnumMainBannersStatus = {}));
let PermissionDocument = exports.PermissionDocument = class PermissionDocument {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], PermissionDocument.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: [] }),
    __metadata("design:type", Array)
], PermissionDocument.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Object)
], PermissionDocument.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Object)
], PermissionDocument.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Object)
], PermissionDocument.prototype, "deleted_at", void 0);
exports.PermissionDocument = PermissionDocument = __decorate([
    (0, typeorm_1.Entity)({
        name: `${(_b = (_a = process.env.SERVICE_NAME) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()) !== null && _b !== void 0 ? _b : 'base'}_permissions`,
    }),
    (0, typeorm_1.Index)(['role_id'])
], PermissionDocument);
//# sourceMappingURL=permission.entity.js.map