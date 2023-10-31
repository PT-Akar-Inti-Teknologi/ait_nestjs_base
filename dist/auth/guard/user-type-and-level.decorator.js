"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypeAndLevel = void 0;
const common_1 = require("@nestjs/common");
const UserTypeAndLevel = (...user_type_and_levels) => (0, common_1.SetMetadata)('user_type_and_levels', user_type_and_levels);
exports.UserTypeAndLevel = UserTypeAndLevel;
//# sourceMappingURL=user-type-and-level.decorator.js.map