import { HashModuleConfig } from './interface/hash-module-config.interface';
export declare class HashService {
    private readonly config;
    constructor(config: HashModuleConfig);
    hashPassword(passwordString: string, salt: string): Promise<string>;
    randomSalt(): Promise<string>;
    generateHashPassword(password: string): Promise<string>;
    bcryptComparePassword(passwordString: string, passwordHashed: string): Promise<boolean>;
    encryptBase64(data: string): Promise<string>;
    decryptBase64(data: string): Promise<string>;
    encryptAES256Bit(data: string | Record<string, any> | Record<string, any>[], key: string, iv: string): Promise<string>;
    decryptAES256Bit(encrypted: string, key: string, iv: string): Promise<string>;
}
//# sourceMappingURL=hash.service.d.ts.map