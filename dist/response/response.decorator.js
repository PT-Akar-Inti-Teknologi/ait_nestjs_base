"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseStatusCode = void 0;
const common_1 = require("@nestjs/common");
const response_filter_1 = require("./response.filter");
const response_interceptor_1 = require("./response.interceptor");
function ResponseStatusCode() {
    return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)(response_interceptor_1.ResponseInterceptor), (0, common_1.UseFilters)(response_filter_1.ResponseFilter));
}
exports.ResponseStatusCode = ResponseStatusCode;
//# sourceMappingURL=response.decorator.js.map