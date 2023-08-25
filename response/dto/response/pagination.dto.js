"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDTO = void 0;
const builder_pattern_1 = require("builder-pattern");
class PaginationDTO {
    constructor() {
        this.page = 0;
    }
    static Builder() {
        return (0, builder_pattern_1.Builder)(this);
    }
}
exports.PaginationDTO = PaginationDTO;
//# sourceMappingURL=pagination.dto.js.map