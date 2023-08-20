"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseSuccessCollectionDTO = void 0;
const builder_pattern_1 = require("builder-pattern");
const ResponseDTO_1 = require("./ResponseDTO");
class ResponseSuccessCollectionDTO extends ResponseDTO_1.ResponseDTO {
    static Builder() {
        return (0, builder_pattern_1.Builder)(this);
    }
}
exports.ResponseSuccessCollectionDTO = ResponseSuccessCollectionDTO;
//# sourceMappingURL=ResponseSuccessCollectionDTO.js.map