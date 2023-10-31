"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
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
        data_success: {
            code: 'GET_DATA_SUCCESS',
            message: 'Data fetched successfully.',
        },
        fail: {
            code: 'FAIL',
            message: 'Failed',
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
        phone_exist: {
            code: 'PHONE_EXIST',
            message: 'Phone is exist.',
        },
        email_exist: {
            code: 'EMAIL_EXIST',
            message: 'Email already in use.',
        },
        title_exist: {
            code: 'TITLE_EXIST',
            message: 'Title is exist.',
        },
        period_exist: {
            code: 'PERIOD_EXIST',
            message: 'Period is exist.',
        },
        no_member_exist: {
            code: 'NO_MEMBER_EXIST',
            message: 'No Member is exist.',
        },
        store_id_exist: {
            code: 'STORE_EXIST',
            message: 'Store is exist.',
        },
        tier_from_id_exist: {
            code: 'TIER_FROM_EXIST',
            message: 'From Tier is exist.',
        },
        tier_to_id_exist: {
            code: 'TIER_TO_EXIST',
            message: 'To Tier is exist.',
        },
        data_invalid: {
            code: 'DATA_INVALID',
            message: 'Data is invalid.',
        },
        data_is_empty: {
            code: 'DATA_IS_EMPTY',
            message: 'Data cannot be empty.',
        },
        data_not_allowed: {
            code: 'DATA_NOT_ALLOWED',
            message: 'Cannot access this data.',
        },
        invalid_user_access: {
            code: 'UNAUTHORIZED USER',
            message: 'User does not have access.',
        },
        status_not_allowed: {
            code: 'STATUS_NOT_ALLOWED',
            message: 'Cannot update data with this status.',
        },
        image_not_modified: {
            code: 'IMAGE_NOT_MODIFIED',
            message: 'Image not changed.',
        },
        invalid_date: {
            code: 'INVALID_DATE',
            message: 'Invalid date.',
        },
        invalid_start_end_date: {
            code: 'INVALID_START_END_DATE',
            message: 'Start date must be earlier than end date.',
        },
        invalid_greater_date: {
            code: 'INVALID_GREATER_DATE',
            message: 'Date must be greater than the current date.',
        },
        date_is_exist: {
            code: 'INVALID_GREATER_DATE',
            message: 'Start date/time is already in use, please choose a different date.',
        },
        date_overlap: {
            code: 'OVERLAP_DATE',
            message: 'Dates should not overlap.',
        },
        date_period_invalid: {
            code: 'INVALID_DATE_PERIOD',
            message: 'Date should be a valid period range.',
        },
        empty_photo: {
            code: 'EMPTY_PHOTO',
            message: 'Photo is empty.',
        },
        is_scheduled: {
            code: 'IS_SCHEDULED',
            message: 'The event is already scheduled.',
        },
        is_ongoing_or_past: {
            code: 'IS_ONGOING_OR_PAST',
            message: 'The event is currently ongoing or has already occurred.',
        },
    },
    redis: {
        create_queue_fail: {
            code: 'CREATE_QUEUE_FAIL',
            message: 'Unable to create queue',
        },
    },
};
//# sourceMappingURL=general.js.map