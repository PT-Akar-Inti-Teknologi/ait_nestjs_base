export default {
  user_id: {
    exist: {
      code: 'USER_ID_EXIST',
      message: 'User ID already exists',
    },
    not_found: {
      code: 'USER_ID_NOT_FOUND',
      message: 'User ID not found',
    },
  },
  user_ids: {
    not_found: {
      code: 'USER_IDS_NOT_FOUND',
      message: 'User IDs not found',
    },
  },
  email: {
    already_used: {
      code: 'EMAIL_ALREADY_USED',
      message: 'Email already in use',
    },
  },
  password: {
    invalid_password: {
      code: 'INVALID_PASSWORD',
      message: 'Invalid password.',
    },
    same_as_old_password: {
      code: 'SAME_AS_OLD_PASSWORD',
      message: 'New password must not be the same as the old password.',
    },
  },
};
