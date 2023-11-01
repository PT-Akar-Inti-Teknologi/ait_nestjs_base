"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePermissionDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const save_permission_dto_1 = require("./save-permission.dto");
class UpdatePermissionDTO extends (0, mapped_types_1.PartialType)(save_permission_dto_1.SavePermissionDTO) {
}
exports.UpdatePermissionDTO = UpdatePermissionDTO;
//# sourceMappingURL=update-permission.dto.js.map