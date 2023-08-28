"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUniqueConstraints = exports.IsUnique = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
/**
 *
 * @param key unique field from given repository
 * @param repository entity that already extends BaseEntity class from typeorm
 * @param additionalField (optional) fill this parameters with field name of this object if you want to except row with field name identity
 * @param validationOptions use this to override class-validator ValidationOptions
 * @returns
 */
function IsUnique(key, repository, additionalField, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: Object.assign({ message: ({ value, property }) => `${property} with ${value} is already registered` }, validationOptions),
            constraints: [key, repository, additionalField],
            validator: IsUniqueConstraints,
        });
    };
}
exports.IsUnique = IsUnique;
let IsUniqueConstraints = exports.IsUniqueConstraints = class IsUniqueConstraints {
    async validate(value, args) {
        try {
            if (value.length === 0)
                return true;
            const [key, repo, additionalField] = args.constraints;
            const additionalFieldValue = args.object[additionalField];
            const where = {
                [key]: value,
            };
            if (additionalField) {
                where.additionalField = (0, typeorm_1.Not)(additionalFieldValue);
            }
            const isExists = await repo.countBy(where);
            return isExists === 0;
        }
        catch (error) {
            return false;
        }
    }
};
exports.IsUniqueConstraints = IsUniqueConstraints = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsUnique', async: true })
], IsUniqueConstraints);
//# sourceMappingURL=is-unique.validator.js.map