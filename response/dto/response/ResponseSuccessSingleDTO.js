"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseSuccessSingleDTO = void 0;
const builder_pattern_1 = require("builder-pattern");
const ResponseDTO_1 = require("./ResponseDTO");
class ResponseSuccessSingleDTO extends ResponseDTO_1.ResponseDTO {
    static Builder() {
        return (0, builder_pattern_1.Builder)(this);
    }
}
exports.ResponseSuccessSingleDTO = ResponseSuccessSingleDTO;
//# sourceMappingURL=ResponseSuccessSingleDTO.js.map