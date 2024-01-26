import {
  CreateRandomNumber,
  camelToSnake,
  createUrl,
  editFileName,
  excelFileFilter,
  formatingAllOutputTime,
  formatingOutputTime,
  generateMessageExpiredPointNotification,
  imageFileFilter,
  imageJpgPngFileFilter,
  removeAllFieldPassword,
  sanitizeHTML,
} from './general-utils';

describe('GeneralUtils', () => {
  it('CreateRandomNumber should return number', () => {
    expect(/^[0-9]+$/.test(CreateRandomNumber(4))).toEqual(true);
  });

  it('CreateRandomNumber should return same length as parameter (only support 4 or 6, else will be assumed as 6)', () => {
    expect(CreateRandomNumber(4)).toHaveLength(4);
    expect(CreateRandomNumber(6)).toHaveLength(6);
    expect(CreateRandomNumber(10)).toHaveLength(6);
  });

  it('excelFileFilter should call callback with correct value', () => {
    const callback = jest.fn();
    excelFileFilter({}, { originalname: 'asd.xlsx' }, callback);
    expect(callback).toBeCalledWith(null, true);
    callback.mockClear();
    excelFileFilter({}, { originalname: 'asd.xls' }, callback);
    expect(callback).toBeCalledWith(null, false);
  });

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
    process.env.BASEURL_API = 'http://localhost/';
    expect(createUrl('/filename.xls', 'api/v1/asd')).toEqual(
      'http://localhost/api/v1/asd/filename.xls',
    );
    expect(createUrl('', 'api/v1/asd')).toEqual(null);
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

  it('sanitizeHTML should return correct value', () => {
    expect(sanitizeHTML('&"\'<>123')).toEqual('&amp;&quot;&apos;&lt;&gt;123');
  });

  it('generateMessageExpiredPointNotification should return correct value', async () => {
    const result = await generateMessageExpiredPointNotification(
      'name',
      100,
      '2020-12-31',
    );
    expect(result.includes('name')).toBeTruthy();
    expect(result.includes('100')).toBeTruthy();
    expect(result.includes('2020-12-31')).toBeTruthy();
  });
});
