export default {
  create: {
    success: {
      code: 'INSERT_DATA_SUCCESS',
      message: 'Data added successfully.',
    },
    fail: {
      code: 'INSERT_DATA_FAIL',
      message: 'Failed to add data.',
    },
  },
  update: {
    success: {
      code: 'UPDATE_DATA_SUCCESS',
      message: 'Data updated successfully.',
    },
    fail: {
      code: 'UPDATE_DATA_FAIL',
      message: 'Failed to update data.',
    },
  },
  list: {
    success: {
      code: 'LIST_DATA_SUCCESS',
      message: 'Data retrieved successfully',
    },
    fail: {
      code: 'LIST_DATA_FAIL',
      message: 'Failed to retrieve data',
    },
  },
  delete: {
    success: {
      code: 'DELETE_DATA_SUCCESS',
      message: 'Data deleted successfully.',
    },
    fail: {
      code: 'DELETE_DATA_FAIL',
      message: 'Failed to delete data.',
    },
  },
  get: {
    success: {
      code: 'GET_DATA_SUCCESS',
      message: 'Data fetched successfully.',
    },
    fail: {
      code: 'GET_DATA_FAIL',
      message: 'Failed to fetch data.',
    },
  },
  general: {
    success: {
      code: 'SUCCESS',
      message: 'Success',
    },
    dataSuccess: {
      code: 'GET_DATA_SUCCESS',
      message: 'Data fetched successfully.',
    },
    fail: {
      code: 'FAIL',
      message: 'Failed',
    },
    dataNotFound: {
      code: 'DATA_NOT_FOUND',
      message: 'Data not found.',
    },
    idNotFound: {
      code: 'ID_NOT_FOUND',
      message: 'Id not found.',
    },
    email_not_found: {
      code: 'EMAIL_NOT_FOUND',
      message: 'Email not found.',
    },
    dataInvalid: {
      code: 'DATA_INVALID',
      message: 'Data is invalid.',
    },
    dataIsEmpty: {
      code: 'DATA_IS_EMPTY',
      message: 'Data cannot be empty.',
    },
    dataNotAllowed: {
      code: 'DATA_NOT_ALLOWED',
      message: 'Cannot access this data.',
    },
    invalidUserAccess: {
      code: 'UNAUTHORIZED USER',
      message: 'User does not have access.',
    },
    statusNotAllowed: {
      code: 'STATUS_NOT_ALLOWED',
      message: 'Cannot update data with this status.',
    },
    imageNotModified: {
      code: 'IMAGE_NOT_MODIFIED',
      message: 'Image not changed.',
    },
    invalidDate: {
      code: 'INVALID_DATE',
      message: 'Invalid date.',
    },
    invalidStartEndDate: {
      code: 'INVALID_START_END_DATE',
      message: 'Start date must be earlier than end date.',
    },
    invalidGreaterDate: {
      code: 'INVALID_GREATER_DATE',
      message: 'Date must be greater than the current date.',
    },
    dateIsExist: {
      code: 'INVALID_GREATER_DATE',
      message:
        'Start date/time is already in use, please choose a different date.',
    },
    data_not_found: {
      code: 'DATA_NOT_FOUND',
      message: 'Data not found.',
    },
    id_not_found: {
      code: 'ID_NOT_FOUND',
      message: 'Id not found.',
    },
    value_exist: {
      code: 'VALUE_EXIST',
      message: 'Value is exist.',
    },
    name_exist: {
      code: 'NAME_EXIST',
      message: 'Name is exist.',
    },
  },
  redis: {
    createQueueFail: {
      code: 'CREATE_QUEUE_FAIL',
      message: 'Unable to create queue',
    },
  },
};
