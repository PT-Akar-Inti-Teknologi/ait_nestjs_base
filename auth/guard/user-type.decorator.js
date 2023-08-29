"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = void 0;
const common_1 = require("@nestjs/common");
const UserType = (...user_types) => (0, common_1.SetMetadata)('user_types', user_types);
exports.UserType = UserType;
//# sourceMappingURL=user-type.decorator.js.map