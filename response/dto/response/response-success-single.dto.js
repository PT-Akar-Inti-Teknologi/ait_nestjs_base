"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseSuccessSingleDTO = void 0;
const builder_pattern_1 = require("builder-pattern");
const response_dto_1 = require("./response.dto");
class ResponseSuccessSingleDTO extends response_dto_1.ResponseDTO {
    static Builder() {
        return (0, builder_pattern_1.Builder)(this);
    }
}
exports.ResponseSuccessSingleDTO = ResponseSuccessSingleDTO;
//# sourceMappingURL=response-success-single.dto.js.map