"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseSuccessCollectionDTO = void 0;
const builder_pattern_1 = require("builder-pattern");
const response_dto_1 = require("./response.dto");
class ResponseSuccessCollectionDTO extends response_dto_1.ResponseDTO {
    static Builder() {
        return (0, builder_pattern_1.Builder)(this);
    }
}
exports.ResponseSuccessCollectionDTO = ResponseSuccessCollectionDTO;
//# sourceMappingURL=response-success-collection.dto.js.map