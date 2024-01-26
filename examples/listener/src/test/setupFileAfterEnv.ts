process.env.APP_LANGUAGE = 'en';

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    __esModule: true,
    ...actual,
  };
});
