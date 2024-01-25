import { randomBytes } from 'crypto';
import moment from 'moment-timezone';
import { extname } from 'path';

/**
 * It generates a random number with a length of 4 or 6 digits
 * @param {number} pjg - number
 * @returns A random number
 */
export function CreateRandomNumber(pjg: number): string {
  const random_number = parseInt(randomBytes(4).toString('hex'), 16).toString();
  if (pjg == 4) {
    return random_number.substring(random_number.length - 4);
  }
  return random_number.substring(random_number.length - 6);
}

/**
 * This is a TypeScript function that filters Excel files based on their file extension.
 * @param {any} req - The `req` parameter is the HTTP request object that contains information about
 * the incoming request, such as headers, query parameters, and body data. It is used in this function
 * to store any validation errors that may occur during the file filtering process.
 * @param {any} file - The `file` parameter is an object that represents the uploaded file. It contains
 * information such as the file's original name, field name, size, and type. The function is using this
 * parameter to check if the file's original name matches the required file extension (.xlsx).
 * @param callback - The callback parameter is a function that is called once the file filter has
 * completed its check. It takes two arguments: an error object (if any) and a boolean value indicating
 * whether the file should be accepted or rejected. If the file should be rejected, the second argument
 * should be false. If the
 */
export const excelFileFilter = (req: any, file: any, callback) => {
  if (!file.originalname.match(/\.(xlsx)$/)) {
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

/**
 * This function renames a file with a random name and the original file extension.
 * @param {any} req - The `req` parameter is the HTTP request object that contains information about
 * the incoming request, such as the headers, query parameters, and request body. However, in this
 * particular function, the `req` parameter is not used.
 * @param {any} file - The `file` parameter is an object that represents the uploaded file. It contains
 * information about the file such as its original name, size, and type.
 * @param {any} callback - The `callback` parameter is a function that is called once the filename has
 * been edited. It takes two arguments: the first argument is an error object (if any), and the second
 * argument is the new filename. The `callback` function is typically provided by the multer middleware
 * to handle the file upload
 */
export const editFileName = (req: any, file: any, callback: any) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = moment().format('x');
  callback(null, `${randomName}-${name}${fileExtName}`);
};

/**
 * This is a TypeScript function that filters out files that are not in the JPG or PNG format.
 * @param {any} req - The `req` parameter is the HTTP request object that contains information about
 * the incoming request, such as headers, query parameters, and body data. In this case, it is being
 * used to store any validation errors that occur during the file filtering process.
 * @param {any} file - The file parameter represents the file being uploaded. It contains information
 * about the file such as its original name, mimetype, and other metadata. The function checks if the
 * file is a valid image file with a .jpg, .jpeg, or .png extension or mimetype. If it is not a valid
 * image
 * @param callback - The callback parameter is a function that is called once the file filter has
 * finished processing. It takes two arguments: an error object (if there is an error) and a boolean
 * value indicating whether the file should be accepted or rejected. If the file should be rejected,
 * the second argument should be false.
 */
export const imageJpgPngFileFilter = (req: any, file: any, callback) => {
  if (
    !file.originalname.match(/\.(jpg|jpeg|png)$/) &&
    !file.mimetype.includes('png') &&
    !file.mimetype.includes('jpg') &&
    !file.mimetype.includes('jpeg')
  ) {
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

/**
 * This is a TypeScript function that filters image files based on their file type and mimetype.
 * @param {any} req - The `req` parameter is the HTTP request object that contains information about
 * the incoming request, such as headers, query parameters, and request body. It is used in this
 * function to store any validation errors that occur during the file filtering process.
 * @param {any} file - The `file` parameter is an object that represents the uploaded file. It contains
 * information such as the file's original name, mimetype, size, and buffer.
 * @param callback - The callback parameter is a function that is called once the file filter has
 * finished processing. It takes two arguments: an error object (if there is an error) and a boolean
 * value indicating whether the file should be accepted or rejected. If the file should be rejected,
 * the second argument should be false.
 */
export const imageFileFilter = (req: any, file: any, callback) => {
  if (
    !file.originalname.match(/\.(jpg|jpeg|png|gif)$/) &&
    !file.mimetype.includes('png') &&
    !file.mimetype.includes('jpg') &&
    !file.mimetype.includes('jpeg') &&
    !file.mimetype.includes('gif')
  ) {
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

/**
 * This is a TypeScript function that filters image and PDF files based on their file type and
 * mimetype.
 * @param {any} req - The `req` parameter is the HTTP request object that contains information about
 * the incoming request, such as headers, query parameters, and request body. In this case, it is used
 * to store any validation errors that occur during the file filtering process.
 * @param {any} file - The file parameter represents the file being uploaded. It contains information
 * about the file such as its original name, mimetype, and other metadata. The function checks if the
 * file is an image or a PDF file and allows only those types of files to be uploaded. If the file is
 * not an image or a
 * @param callback - The callback parameter is a function that is called once the file filter has
 * completed its check. It takes two arguments: an error object (if there is an error) and a boolean
 * value indicating whether the file should be accepted or rejected. If the file should be rejected,
 * the second argument should be false
 */
export const imageAndPdfFileFilter = (req: any, file: any, callback) => {
  if (
    !file.originalname.match(/\.(jpg|jpeg|png|pdf)$/) &&
    !file.mimetype.includes('png') &&
    !file.mimetype.includes('jpg') &&
    !file.mimetype.includes('jpeg') &&
    !file.mimetype.includes('pdf')
  ) {
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

/**
 * This TypeScript function creates a URL for an image file using a given filename and path URL.
 * @param {any} filename - The filename parameter is a variable that represents the name of a file.
 * @param [pathUrl=/api/v1/storage/image] - The `pathUrl` parameter is a string that represents the
 * path to the API endpoint where the image file will be stored. It has a default value of
 * `/api/v1/storage/image` but can be overridden by passing a different value as an argument when
 * calling the `createUrl` function.
 * @returns The function `createUrl` returns a URL string that concatenates the
 * `process.env.BASEURL_API` with the `pathUrl` and `filename` parameters. If the `filename` parameter
 * is undefined, null, or an empty string, the function returns null.
 */
export const createUrl = function (
  filename: any,
  pathUrl = '/api/v1/storage/image',
) {
  if (typeof filename == 'undefined' || filename == null || filename == '') {
    return null;
  } else {
    return process.env.BASEURL_API + pathUrl + filename;
  }
};

/**
 * It takes a string as an input, and returns a string as an output
 * @param {string} time - string
 * @returns A function that takes a string as an argument and returns a string.
 */
export const formatingOutputTime = function formatingOutputTime(time: string) {
  return moment(time).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
};

/**
 * It takes an object and recursively searches for any keys that end with '_at' and then formats the
 * value of that key
 * @param {any} object - any - the object that you want to format
 */
export const formatingAllOutputTime = function formatingAllOutputTime(
  object: any,
) {
  for (const key in object) {
    if (object[key] && key.endsWith('_at')) {
      object[key] = formatingOutputTime(object[key]);
    }
    if (object[key] && typeof object[key] === 'object') {
      formatingAllOutputTime(object[key]);
    }
  }
};

/**
 * It removes all fields that end with 'password' from an object
 * @param {any} object - any - The object to remove the password fields from.
 */
export const removeAllFieldPassword = function removeAllFieldPassword(
  object: any,
) {
  for (const key in object) {
    if (object[key] && key.endsWith('password')) {
      delete object[key];
    }
    if (object[key] && typeof object[key] === 'object') {
      removeAllFieldPassword(object[key]);
    }
  }
};

/**
 * It takes a camelCase string and returns a snake_case string
 * @param {string} camel - string - The camel case string to convert to snake case.
 * @returns A function that takes a string and returns a string.
 */
export const camelToSnake = function camelToSnake(camel: string): string {
  return camel.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * It takes a string and returns a new string with all the HTML special characters replaced with their
 * HTML entities
 * @param inputString - The string to be sanitized.
 * @returns A string with the characters &, ", ', <, and > replaced with their HTML entity equivalents.
 */
export function sanitizeHTML(inputString) {
  const lookup = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
  };
  return inputString.replace(/[&"'<>]/g, (character) => lookup[character]);
}

const STYLE_HEADER =
  "font-weight:700;min-height: 10px;left: 0px;top: 40px;font-family: 'Lato';font-style: normal;font-size: 20px;line-height: 24px;font-feature-settings: 'pnum'on, 'lnum'on;color: #26272A;align-self: stretch;";
const CONTENT =
  "min-height: 10px;left: 0px;top: 40px;font-family: 'Lato';font-style: normal;font-size: 20px;line-height: 24px;font-feature-settings: 'pnum'on, 'lnum'on;color: #26272A;flex: none;order: 1;align-self: stretch;flex-grow: 0;";
export const generateMessageExpiredPointNotification = async (
  name: string,
  total_point: number,
  expired_at: string,
): Promise<string> => {
  return `
  <p style="${STYLE_HEADER}">Hai, ${name || 'User'}!</p>
  <p style="${CONTENT}"> Anda memiliki sisa ${total_point} yang akan hangus pada ${expired_at}. </p>
  <p style="${CONTENT}"> JANGAN BAGIKAN LINK TERSEBUT KE SIAPAPUN termasuk ADMIN. <br>
  WASPADA PENIPUAN! </p>`;
};
