"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
const common_1 = require("@nestjs/common");
const Permission = (...permission) => (0, common_1.SetMetadata)('permission', permission);
exports.Permission = Permission;
//# sourceMappingURL=permission.decorator.js.map