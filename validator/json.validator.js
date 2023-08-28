"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonArrayToArrayUUID = void 0;
const class_validator_1 = require("class-validator");
/**
 * Convert and validate string json array to array uuid
 * @constructor
 */
function JsonArrayToArrayUUID() {
    return (object, propertyName) => (0, class_validator_1.registerDecorator)({
        target: object.constructor,
        propertyName: propertyName,
        options: { message: `${propertyName} must json array string of uuid` },
        validator: {
            validate(value, args) {
                let valid = value === void 0;
                if (!valid) {
                    valid =
                        (0, class_validator_1.isJSON)(value) &&
                            JSON.parse(value).every((v) => {
                                return !v || (0, class_validator_1.isUUID)(v);
                            });
                    if (valid) {
                        Object.defineProperty(args.object, propertyName, {
                            value: JSON.parse(value),
                        });
                    }
                }
                return valid;
            },
        },
    });
}
exports.JsonArrayToArrayUUID = JsonArrayToArrayUUID;
//# sourceMappingURL=json.validator.js.map