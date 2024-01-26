import {
  camelToSnake,
  createUrl,
  dbOutputTime,
  editFileName,
  formatingAllOutputTime,
  formatingOutputTime,
  generateMessageChangeActiveEmail,
  generateMessageCreateTicket,
  generateMessageResetPassword,
  generateMessageUrlForgotPasswordVerification,
  generateMessageUrlVerification,
  generateSmsChangeActiveNoHp,
  generateSmsResetPassword,
  generateSmsUrlVerification,
  imageAndPdfFileFilter,
  imageFileFilter,
  imageJpgPngFileFilter,
  parseHtml,
  removeAllFieldPassword,
} from './general.utils';

describe('GeneralUtils', () => {
  it('editFileName should call callback with correct value', () => {
    let result: any;
    const callback = (_: any, value: any) => (result = value);
    editFileName({}, { originalname: 'asd.xlsx' }, callback);
    expect(/^[0-9]+-asd\.xlsx$/.test(result)).toEqual(true);
  });

  it('imageJpgPngFileFilter should call callback with correct value', () => {
    const callback = jest.fn();
    imageJpgPngFileFilter(
      {},
      { originalname: 'asd.jpg', mimetype: ['jpg'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    imageJpgPngFileFilter(
      {},
      { originalname: 'asd.jpeg', mimetype: ['jpeg'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    imageJpgPngFileFilter(
      {},
      { originalname: 'asd.png', mimetype: ['png'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    imageJpgPngFileFilter(
      {},
      { originalname: 'asd.gif', mimetype: ['gif'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, false);
  });

  it('imageAndPdfFileFilter should call callback with correct value', () => {
    const callback = jest.fn();
    imageAndPdfFileFilter(
      {},
      { originalname: 'asd.jpg', mimetype: ['jpg'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    imageAndPdfFileFilter(
      {},
      { originalname: 'asd.jpeg', mimetype: ['jpeg'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    imageAndPdfFileFilter(
      {},
      { originalname: 'asd.png', mimetype: ['png'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    imageAndPdfFileFilter(
      {},
      { originalname: 'asd.pdf', mimetype: ['pdf'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    imageAndPdfFileFilter(
      {},
      { originalname: 'asd.gif', mimetype: ['gif'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, false);
  });

  it('imageFileFilter should call callback with correct value', () => {
    const callback = jest.fn();
    imageFileFilter(
      {},
      { originalname: 'asd.jpg', mimetype: ['jpg'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    imageFileFilter(
      {},
      { originalname: 'asd.jpeg', mimetype: ['jpeg'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    imageFileFilter(
      {},
      { originalname: 'asd.png', mimetype: ['png'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    imageFileFilter(
      {},
      { originalname: 'asd.gif', mimetype: ['gif'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    imageFileFilter(
      {},
      { originalname: 'asd.pdf', mimetype: ['pdf'] },
      callback,
    );
    expect(callback).toBeCalledWith(null, false);
  });

  it('createUrl should return correct value', () => {
    process.env.BASEURL_API = 'http://localhost';
    expect(createUrl('/filename.xls')).toEqual(
      'http://localhost/api/v1/catalogs/image/filename.xls',
    );
    expect(createUrl('')).toEqual('');
  });

  it('dbOutputTime should return correct value', () => {
    const object = {
      others_at: '2020-12-31T00:00:00+00:00',
      approved_at: '2020-12-31T00:00:00+00:00',
      created_at: '2020-12-31T00:00:00+00:00',
      updated_at: '2020-12-31T07:00:00+00:00',
    };
    dbOutputTime(object);
    expect(object).toEqual({
      others_at: '2020-12-31T00:00:00+00:00',
      approved_at: '2020-12-31 07:00:00',
      created_at: '2020-12-31 07:00:00',
      updated_at: '2020-12-31 14:00:00',
    });
  });

  it('formatingOutputTime should return correct value', () => {
    expect(formatingOutputTime('2020-12-31T00:00:00+00:00')).toEqual(
      '2020-12-31 07:00:00',
    );
  });

  it('formatingAllOutputTime should alter object properly', () => {
    const object = {
      test: {
        created_at: '2020-12-31T00:00:00+00:00',
        updated_at: '2020-12-31T07:00:00+00:00',
      },
      created_at: '2020-12-31T00:00:00+00:00',
      updated_at: '2020-12-31T07:00:00+00:00',
    };
    formatingAllOutputTime(object);
    expect(object).toEqual({
      test: {
        created_at: '2020-12-31 07:00:00',
        updated_at: '2020-12-31 14:00:00',
      },
      created_at: '2020-12-31 07:00:00',
      updated_at: '2020-12-31 14:00:00',
    });
  });

  it('removeAllFieldPassword should alter object properly', () => {
    const object = {
      user: {
        created_at: '2020-12-31T00:00:00+00:00',
        updated_at: '2020-12-31T07:00:00+00:00',
        password: '123',
      },
      created_at: '2020-12-31T00:00:00+00:00',
      updated_at: '2020-12-31T07:00:00+00:00',
      password: '123',
      repeat_password: '123',
    };
    removeAllFieldPassword(object);
    expect(object).toEqual({
      user: {
        created_at: '2020-12-31T00:00:00+00:00',
        updated_at: '2020-12-31T07:00:00+00:00',
      },
      created_at: '2020-12-31T00:00:00+00:00',
      updated_at: '2020-12-31T07:00:00+00:00',
    });
  });

  it('camelToSnake should return correct value', () => {
    expect(camelToSnake('asdFghJkl')).toEqual('asd_fgh_jkl');
  });

  it('generateMessageUrlVerification should return correct value', async () => {
    const result = await generateMessageUrlVerification('11111111', '22222222');
    expect(result.includes('11111111')).toBeTruthy();
    expect(result.includes('22222222')).toBeTruthy();
  });

  it('generateMessageUrlForgotPasswordVerification should return correct value', async () => {
    const result = await generateMessageUrlForgotPasswordVerification(
      '11111111',
      '22222222',
    );
    expect(result.includes('11111111')).toBeTruthy();
    expect(result.includes('22222222')).toBeTruthy();
  });

  it('generateMessageChangeActiveEmail should return correct value', async () => {
    const result = await generateMessageChangeActiveEmail('11111111');
    expect(result.includes('11111111')).toBeTruthy();
  });

  it('generateMessageResetPassword should return correct value', async () => {
    const result = await generateMessageResetPassword('11111111', '22222222');
    expect(result.includes('11111111')).toBeTruthy();
    expect(result.includes('22222222')).toBeTruthy();
  });

  it('generateMessageCreateTicket should return correct value', async () => {
    const result = await generateMessageCreateTicket('11111111', '22222222');
    expect(result.includes('11111111')).toBeTruthy();
    expect(result.includes('22222222')).toBeTruthy();
  });

  it('generateSmsUrlVerification should return correct value', async () => {
    const result = await generateSmsUrlVerification('11111111', '22222222');
    expect(result.includes('11111111')).toBeTruthy();
    expect(result.includes('22222222')).toBeTruthy();
  });

  it('generateSmsChangeActiveNoHp should return correct value', async () => {
    const result = generateSmsChangeActiveNoHp('11111111');
    expect(result.includes('11111111')).toBeTruthy();
  });

  it('generateSmsResetPassword should return correct value', async () => {
    const result = await generateSmsResetPassword('11111111', '22222222');
    expect(result.includes('11111111')).toBeTruthy();
    expect(result.includes('22222222')).toBeTruthy();
  });

  it('parseHtml should replace correct value', () => {
    expect(parseHtml({ a: 'aaa', b: 'bbb' }, '{{ a }}|{{ b }}')).toEqual(
      'aaa|bbb',
    );
  });
});
