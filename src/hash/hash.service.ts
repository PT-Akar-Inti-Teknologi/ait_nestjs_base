import { promisify } from 'util';
import { isString } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { hash, compare, genSalt, genSaltSync } from 'bcryptjs';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';

import { PASSWORD_SALT_LENGTH } from './hash.constant';

@Injectable()
export class HashService {
  // bcrypt
  async hashPassword(passwordString: string, salt: string): Promise<string> {
    return hash(passwordString, salt);
  }

  async randomSalt(): Promise<string> {
    // Env Variable
    const defaultPasswordSaltLength: number =
      Number(process.env.HASH_PASSWORDSALTLENGTH) || PASSWORD_SALT_LENGTH;

    return genSalt(defaultPasswordSaltLength);
  }

  async generateHashPassword(password: string): Promise<string> {
    const defaultSalt: number =
      Number(process.env.HASH_PASSWORDSALTLENGTH) || 10;
    const salt = genSaltSync(defaultSalt);

    return hash(password, salt);
  }

  async bcryptComparePassword(
    passwordString: string,
    passwordHashed: string,
  ): Promise<boolean> {
    return compare(passwordString, passwordHashed);
  }

  // Base64
  async encryptBase64(data: string): Promise<string> {
    const buff: Buffer = Buffer.from(data);
    return buff.toString('base64');
  }
  async decryptBase64(data: string): Promise<string> {
    const buff: Buffer = Buffer.from(data, 'base64');
    return buff.toString('utf8');
  }

  // AES 256bit
  async encryptAES256Bit(
    data: string | Record<string, any> | Record<string, any>[],
    key: string,
    iv: string,
  ): Promise<string> {
    let dataParse: string = data as string;
    if (!isString(data)) {
      dataParse = JSON.stringify(data);
    }

    const crp = (await promisify(scrypt)(key, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-gcm', crp, iv);

    const encryptedText = Buffer.concat([
      cipher.update(dataParse),
      cipher.final(),
    ]);

    return encryptedText.toString('base64');
  }

  async decryptAES256Bit(
    encrypted: string,
    key: string,
    iv: string,
  ): Promise<string> {
    const data: Buffer = Buffer.from(encrypted, 'base64');
    const crp = (await promisify(scrypt)(key, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-gcm', crp, iv);
    const decryptedText = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ]);

    return decryptedText.toString('utf8');
  }
}
