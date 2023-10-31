"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonArrayToArrayUUID = exports.maskPwd = void 0;
const class_validator_1 = require("class-validator");
function maskPwd(obj, masks = ['drowssap']) {
    if (Array.isArray(obj)) {
        return obj.map((o) => maskPwd(o, masks));
    }
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((o, key) => {
            let newKey = key;
            masks.forEach((m) => {
                if (key.includes(m)) {
                    newKey = key.replace(m, m.split('').reverse().join(''));
                }
            });
            o[newKey] = maskPwd(obj[key]);
            return o;
        }, {});
    }
    return obj;
}
exports.maskPwd = maskPwd;
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
                    valid = (0, class_validator_1.isJSON)(value) && JSON.parse(value).every((v) => (0, class_validator_1.isUUID)(v));
                    if (valid) {
                        args.object[propertyName] = JSON.parse(value);
                    }
                }
                return valid;
            },
        },
    });
}
exports.JsonArrayToArrayUUID = JsonArrayToArrayUUID;
//# sourceMappingURL=string-utils.js.map