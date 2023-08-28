"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchConstraints = exports.Match = void 0;
const class_validator_1 = require("class-validator");
function Match(relatedPropertyName, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: Object.assign({ message: ({ property }) => `${property} doesn't match` }, validationOptions),
            constraints: [relatedPropertyName],
            validator: MatchConstraints,
        });
    };
}
exports.Match = Match;
let MatchConstraints = exports.MatchConstraints = class MatchConstraints {
    validate(value, validationArguments) {
        const [relatedPropertyName] = validationArguments.constraints;
        const relatedValue = validationArguments.object[relatedPropertyName];
        return value === relatedValue;
    }
};
exports.MatchConstraints = MatchConstraints = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'Match', async: false })
], MatchConstraints);
//# sourceMappingURL=match.validator.js.map