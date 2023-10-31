"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePermissionDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const save_permission_dto_1 = __importDefault(require("./save-permission.dto"));
class UpdatePermissionDTO extends (0, mapped_types_1.PartialType)(save_permission_dto_1.default) {
}
exports.UpdatePermissionDTO = UpdatePermissionDTO;
//# sourceMappingURL=update-permission.dto.js.map