process.env.APP_LANGUAGE = 'en';
process.env.BASEURL_TEST_SERVICE = 'http://localhost/';

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    __esModule: true,
    ...actual,
  };
});
