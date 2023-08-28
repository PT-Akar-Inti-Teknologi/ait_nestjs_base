"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashService = void 0;
const util_1 = require("util");
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const bcryptjs_1 = require("bcryptjs");
const crypto_1 = require("crypto");
const hash_constant_1 = require("./hash.constant");
let HashService = exports.HashService = class HashService {
    // bcrypt
    async hashPassword(passwordString, salt) {
        return (0, bcryptjs_1.hash)(passwordString, salt);
    }
    async randomSalt() {
        // Env Variable
        const defaultPasswordSaltLength = Number(process.env.HASH_PASSWORDSALTLENGTH) || hash_constant_1.PASSWORD_SALT_LENGTH;
        return (0, bcryptjs_1.genSalt)(defaultPasswordSaltLength);
    }
    async generateHashPassword(password) {
        const defaultSalt = Number(process.env.HASH_PASSWORDSALTLENGTH) || 10;
        const salt = (0, bcryptjs_1.genSaltSync)(defaultSalt);
        return (0, bcryptjs_1.hash)(password, salt);
    }
    async bcryptComparePassword(passwordString, passwordHashed) {
        return (0, bcryptjs_1.compare)(passwordString, passwordHashed);
    }
    // Base64
    async encryptBase64(data) {
        const buff = Buffer.from(data);
        return buff.toString('base64');
    }
    async decryptBase64(data) {
        const buff = Buffer.from(data, 'base64');
        return buff.toString('utf8');
    }
    // AES 256bit
    async encryptAES256Bit(data, key, iv) {
        let dataParse = data;
        if (!(0, class_validator_1.isString)(data)) {
            dataParse = JSON.stringify(data);
        }
        const crp = (await (0, util_1.promisify)(crypto_1.scrypt)(key, 'salt', 32));
        const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', crp, iv);
        const encryptedText = Buffer.concat([
            cipher.update(dataParse),
            cipher.final(),
        ]);
        return encryptedText.toString('base64');
    }
    async decryptAES256Bit(encrypted, key, iv) {
        const data = Buffer.from(encrypted, 'base64');
        const crp = (await (0, util_1.promisify)(crypto_1.scrypt)(key, 'salt', 32));
        const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', crp, iv);
        const decryptedText = Buffer.concat([
            decipher.update(data),
            decipher.final(),
        ]);
        return decryptedText.toString('utf8');
    }
};
exports.HashService = HashService = __decorate([
    (0, common_1.Injectable)()
], HashService);
//# sourceMappingURL=hash.service.js.map