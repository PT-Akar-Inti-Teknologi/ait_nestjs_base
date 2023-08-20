"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessageDTO = void 0;
const builder_pattern_1 = require("builder-pattern");
class ErrorMessageDTO {
    constructor() {
        this.field = '';
        this.message = '';
        this.code = '';
    }
    static Builder() {
        return (0, builder_pattern_1.Builder)(this);
    }
}
exports.ErrorMessageDTO = ErrorMessageDTO;
//# sourceMappingURL=ErrorMessageDTO.js.map