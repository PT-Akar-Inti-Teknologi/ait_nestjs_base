import moment from 'moment';
import momenttz from 'moment-timezone';
import { extname } from 'path';

export const editFileName = (req: any, file: any, callback: any) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = moment().format('x');

  callback(null, `${randomName}-${name}${fileExtName}`);
};

export const imageFileFilter = (req: any, file: any, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    if (!req.fileValidationError) {
      req.fileValidationError = [];
    }
    const error = {
      value: file.originalname,
      property: file.fieldname,
      constraint: 'file.image.not_allowed',
    };
    req.fileValidationError.push(error);
    callback(null, false);
  }
  callback(null, true);
};

export const imageJpgPngFileFilter = (req: any, file: any, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    if (!req.fileValidationError) {
      req.fileValidationError = [];
    }
    const error = {
      value: file.originalname,
      property: file.fieldname,
      constraint: 'file.image.not_allowed',
    };
    req.fileValidationError.push(error);
    callback(null, false);
  }
  callback(null, true);
};

export const imageAndPdfFileFilter = (req: any, file: any, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
    if (!req.fileValidationError) {
      req.fileValidationError = [];
    }
    const error = {
      value: file.originalname,
      property: file.fieldname,
      constraint: 'file.image.not_allowed',
    };
    req.fileValidationError.push(error);
    callback(null, false);
  }
  callback(null, true);
};

export const createUrl = function (filename: any) {
  if (typeof filename == 'undefined' || filename == null || filename == '') {
    return '';
  } else {
    return process.env.BASEURL_API + '/api/v1/catalogs/image' + filename;
  }
};

export const dbOutputTime = function (input: Record<string, any>) {
  if (input != null) {
    if (
      typeof input.approved_at != 'undefined' &&
      input.approved_at != null &&
      input.approved_at != 'undefined' &&
      input.approved_at != ''
    ) {
      input.approved_at = momenttz(input.approved_at)
        .tz('Asia/Jakarta')
        .format('YYYY-MM-DD HH:mm:ss');
    }
    if (
      typeof input.created_at != 'undefined' &&
      input.created_at != null &&
      input.created_at != 'undefined' &&
      input.created_at != ''
    ) {
      input.created_at = momenttz(input.created_at)
        .tz('Asia/Jakarta')
        .format('YYYY-MM-DD HH:mm:ss');
    }
    if (
      typeof input.updated_at != 'undefined' &&
      input.updated_at != null &&
      input.updated_at != 'undefined' &&
      input.updated_at != ''
    ) {
      input.updated_at = momenttz(input.updated_at)
        .tz('Asia/Jakarta')
        .format('YYYY-MM-DD HH:mm:ss');
    }
  }
  return input;
};

export const formatingOutputTime = function formatingOutputTime(
  time: string | Date,
) {
  return momenttz(time).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
};

export const formatingAllOutputTime = function formatingAllOutputTime(
  object: any,
): any {
  for (const key in object) {
    if (object[key] && key.endsWith('_at')) {
      object[key] = formatingOutputTime(object[key]);
    }
    if (object[key] && typeof object[key] === 'object') {
      formatingAllOutputTime(object[key]);
    }
  }

  return object;
};

export const removeAllFieldPassword = function removeAllFieldPassword(
  object: any,
) {
  for (const key in object) {
    if (key.endsWith('password')) {
      delete object[key];
    } else if (object[key] && typeof object[key] === 'object') {
      removeAllFieldPassword(object[key]);
    }
  }
};

export const camelToSnake = function camelToSnake(camel: string): string {
  return camel.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const STYLE_HEADER =
  "font-weight:700;min-height: 10px;left: 0px;top: 40px;font-family: 'Lato';font-style: normal;font-size: 20px;line-height: 24px;font-feature-settings: 'pnum'on, 'lnum'on;color: #26272A;align-self: stretch;";
const CONTENT =
  "min-height: 10px;left: 0px;top: 40px;font-family: 'Lato';font-style: normal;font-size: 20px;line-height: 24px;font-feature-settings: 'pnum'on, 'lnum'on;color: #26272A;flex: none;order: 1;align-self: stretch;flex-grow: 0;";
const CONTENT16 =
  "min-height: 10px;left: 0px;top: 40px;font-family: 'Lato';font-style: normal;font-size: 16px;line-height: 24px;font-feature-settings: 'pnum'on, 'lnum'on;color: #26272A;flex: none;order: 1;align-self: stretch;flex-grow: 0;";
const CONTENT16BOLD =
  "min-height: 10px;left: 0px;top: 40px;font-family: 'Lato';font-style: normal;font-size: 16px;line-height: 24px;font-feature-settings: 'pnum'on, 'lnum'on;color: #26272A;flex: none;order: 1;align-self: stretch;flex-grow: 0;font-weight: 700;";
const PLACEHOLDER =
  "font-family: 'Lato';font-style: normal;font-weight: 400;font-size: 14px;line-height: 24px;color: rgba(38, 39, 42, 0.5);";
export const generateMessageUrlVerification = async (
  name: string,
  link: string,
): Promise<string> => {
  return `
  <p style="${STYLE_HEADER}">Hai, ${name || 'User'}!</p>
  <p style="${CONTENT}"> Untuk verifikasi Email Anda klik link berikut: <a href="${link}">${link}</a> . </p>
  <p style="${CONTENT}"> JANGAN BAGIKAN LINK TERSEBUT KE SIAPAPUN termasuk ADMIN. <br>
  WASPADA PENIPUAN! </p>`;
};
export const generateMessageUrlForgotPasswordVerification = async (
  name: string,
  link: string,
): Promise<string> => {
  return `
  <p style="${STYLE_HEADER}">Hai, ${name || 'User'}!</p>
  <p style="${CONTENT}"> Untuk mereset Password Anda klik link berikut: <a href="${link}">${link}</a> . </p>
  <p style="${CONTENT}"> JANGAN BAGIKAN LINK TERSEBUT KE SIAPAPUN termasuk ADMIN. <br>
  WASPADA PENIPUAN! </p>`;
};

export const generateMessageChangeActiveEmail = (name: string): string => {
  return `
  <h1 style="${STYLE_HEADER}>Hai, ${name || 'User'}!</h1>
  <p style="${CONTENT}"> Alamat email Anda berhasil diperbaharui, Anda dapat login pada aplikasi ADMIN menggunakan email ini.</p>`;
};

export const generateMessageResetPassword = async (
  name: string,
  link: string,
): Promise<string> => {
  return `
  <h1 style="${STYLE_HEADER}>Hai, ${name || 'User'}!</h1>
  <p style="${CONTENT}"> Untuk mengubah Kata Sandi Anda, Klik link berikut: <a href="${link}">${link}</a> . </p>
  <p style="${CONTENT}"> JANGAN BAGIKAN LINK TERSEBUT KE SIAPAPUN termasuk ADMIN. <br>
  WASPADA PENIPUAN! </p>`;
};

export const generateMessageCreateTicket = async (
  name: string,
  no_ticket: string,
): Promise<string> => {
  const ticketBanner = 'https://ADMIN.co.id/images/ADMIN-banner.png';
  return `
  <p style="${STYLE_HEADER}"> Dear, ${name || 'User'}! </p>
  <p style="${CONTENT16}"> Terima kasih telah menghubungi Pusat Bantuan ADMIN. </p>
  <p style="${CONTENT16}"> Kami sangat menghargai setiap masukan yang dapat membuat pelayanan kami lebih baik untuk Anda. </p>
  <p style="${CONTENT16}"> Kami sampaikan laporan Anda dengan nomor ${no_ticket} telah kami terima. </p>
  <p style="${CONTENT16}"> Mohon maaf atas ketidaknyamanan yang Anda alami. Mohon kesediaannya untuk menunggu, kami akan segera membalas laporan Anda. </p> <br/>
  <p style="${CONTENT16}"> Salam Hangat, </p>
  <p style="${CONTENT16BOLD}"> Emily </p>
  <p style="${CONTENT16}"> ADMIN Customer Service </p>
  <img src="${ticketBanner}" width="100%" />
  <p style="${PLACEHOLDER}"> Email ini dibuat secara otomatis. Mohon tidak membalas email ini. </p>
  `;
};

export const generateSmsUrlVerification = async (
  name: string,
  link: string,
): Promise<string> => {
  return `Hai, ${
    name || 'User'
  }!\n\nUntuk verifikasi No HP Anda klik link berikut: ${link} .\nJANGAN BAGIKAN LINK TERSEBUT KE SIAPAPUN termasuk ADMIN.\nWASPADA PENIPUAN!
  `;
};

export const generateSmsChangeActiveNoHp = (name: string): string => {
  return `Hai, ${
    name || 'User'
  }!\n\nNo HP Anda berhasil diperbaharui, Anda dapat login pada aplikasi ADMIN menggunakan No HP ini.!`;
};

export const generateSmsResetPassword = async (
  name: string,
  link: string,
): Promise<string> => {
  return `Hai, ${
    name || 'User'
  }!\n\nUntuk mengubah Kata Sandi Anda, Klik link berikut: ${link} .\nJANGAN BAGIKAN LINK TERSEBUT KE SIAPAPUN termasuk ADMIN.\nWASPADA PENIPUAN!`;
};

export const parseHtml = (
  payload: { [k: string]: any },
  htmlString: string,
) => {
  const payloadKeys = Object.keys(payload);

  payloadKeys.forEach((key) => {
    const replaceProps = payload[key];
    key = `{{ ${key} }}`;

    htmlString = htmlString.replace(key, replaceProps);
  });

  return htmlString;
};

export const isUUID = (text: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regexExp.test(text);
};
