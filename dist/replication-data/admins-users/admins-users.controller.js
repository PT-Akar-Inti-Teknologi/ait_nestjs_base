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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsUsersController = void 0;
const common_1 = require("@nestjs/common");
const admins_users_service_1 = require("./admins-users.service");
const response_service_1 = require("../../response/response.service");
const save_admins_user_dto_1 = require("./dto/save-admins-user.dto");
const delete_admins_user_dto_1 = require("./dto/delete-admins-user.dto");
let AdminsUsersController = class AdminsUsersController {
    constructor(usersService, responseService) {
        this.usersService = usersService;
        this.responseService = responseService;
    }
    async save(saveAdminsUserDTO) {
        const result = await this.usersService.save(saveAdminsUserDTO);
        return this.responseService.success(result);
    }
    async remove(deleteUserDTO) {
        const deleteUser = await this.usersService.delete(deleteUserDTO.user_id);
        return this.responseService.success(deleteUser);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_admins_user_dto_1.SaveAdminsUserDTO]),
    __metadata("design:returntype", Promise)
], AdminsUsersController.prototype, "save", null);
__decorate([
    (0, common_1.Delete)(':user_id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_admins_user_dto_1.DeleteAdminsUserDTO]),
    __metadata("design:returntype", Promise)
], AdminsUsersController.prototype, "remove", null);
AdminsUsersController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [admins_users_service_1.AdminsUsersService,
        response_service_1.ResponseService])
], AdminsUsersController);
exports.AdminsUsersController = AdminsUsersController;
//# sourceMappingURL=admins-users.controller.js.map