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
exports.AdminsUserDocument = void 0;
const typeorm_1 = require("typeorm");
const permission_entity_1 = require("../../permissions/entities/permission.entity");
let AdminsUserDocument = class AdminsUserDocument {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], AdminsUserDocument.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AdminsUserDocument.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AdminsUserDocument.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AdminsUserDocument.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AdminsUserDocument.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permission_entity_1.PermissionDocument, (permission) => permission.role_id),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", permission_entity_1.PermissionDocument)
], AdminsUserDocument.prototype, "permission", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], AdminsUserDocument.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AdminsUserDocument.prototype, "is_superadmin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Object)
], AdminsUserDocument.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Object)
], AdminsUserDocument.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Object)
], AdminsUserDocument.prototype, "deleted_at", void 0);
AdminsUserDocument = __decorate([
    (0, typeorm_1.Entity)({
        name: 'admins_users',
    }),
    (0, typeorm_1.Index)(['role_id', 'id'])
], AdminsUserDocument);
exports.AdminsUserDocument = AdminsUserDocument;
//# sourceMappingURL=user.entity.js.map