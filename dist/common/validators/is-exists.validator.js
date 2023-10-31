"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsExistsConstraints = exports.IsExists = void 0;
const class_validator_1 = require("class-validator");
/**
 *
 * @param key unique field from given entity
 * @param repository entity class that already extends BaseEntity class from typeorm
 * @param validationOptions use this to override class-validator ValidationOptions
 * @returns
 */
function IsExists(key, repository, additionalField, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: Object.assign({ message: ({ value, property }) => `${property} with '${value}' is not exists` }, validationOptions),
            constraints: [key, repository, additionalField],
            validator: IsExistsConstraints,
        });
    };
}
exports.IsExists = IsExists;
let IsExistsConstraints = class IsExistsConstraints {
    async validate(value, args) {
        try {
            const [key, repo] = args.constraints;
            const isExists = await repo.count({
                where: {
                    [key]: value,
                },
                cache: {
                    miliseconds: 30000,
                },
            });
            return isExists > 0;
        }
        catch (error) {
            return false;
        }
    }
};
IsExistsConstraints = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsExists', async: true })
], IsExistsConstraints);
exports.IsExistsConstraints = IsExistsConstraints;
//# sourceMappingURL=is-exists.validator.js.map