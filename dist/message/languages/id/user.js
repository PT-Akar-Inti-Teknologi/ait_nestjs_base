"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    user_id: {
        exist: {
            code: 'USER_ID_EXIST',
            message: 'ID pengguna sudah ada',
        },
        not_found: {
            code: 'USER_ID_NOT_FOUND',
            message: 'ID pengguna tidak ditemukan',
        },
    },
    user_ids: {
        not_found: {
            code: 'USER_IDS_NOT_FOUND',
            message: 'ID pengguna tidak ditemukan',
        },
    },
    email: {
        already_used: {
            code: 'EMAIL_ALREADY_USED',
            message: 'Email sudah digunakan',
        },
    },
    password: {
        invalid_password: {
            code: 'INVALID_PASSWORD',
            message: 'Kata sandi tidak valid.',
        },
        same_as_old_password: {
            code: 'SAME_AS_OLD_PASSWORD',
            message: 'Kata sandi baru tidak boleh sama dengan kata sandi lama.',
        },
    },
};
//# sourceMappingURL=user.js.map