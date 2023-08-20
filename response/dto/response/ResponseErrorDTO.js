"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseErrorDTO = void 0;
const builder_pattern_1 = require("builder-pattern");
const ResponseDTO_1 = require("./ResponseDTO");
class ResponseErrorDTO extends ResponseDTO_1.ResponseDTO {
    static Builder() {
        return (0, builder_pattern_1.Builder)(this);
    }
}
exports.ResponseErrorDTO = ResponseErrorDTO;
//# sourceMappingURL=ResponseErrorDTO.js.map