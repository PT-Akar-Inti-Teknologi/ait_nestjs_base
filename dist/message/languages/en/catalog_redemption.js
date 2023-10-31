"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    product_id: {
        empty: {
            code: 'PRODUCT_ID_EMPTY',
            message: 'Product ID is empty.',
        },
        exist: {
            code: 'PRODUCT_ID_EXIST',
            message: 'Product ID is exist.',
        },
    },
    period: {
        expired: {
            code: 'PERIOD_EXPIRED',
            message: 'Redeem periode expired',
        },
        not_active: {
            code: 'PERIOD_NOT_YET_ACTIVE',
            message: 'Redeem periode not yet active',
        },
    },
    voucher: {
        redeemed: {
            code: 'VOUCHER_REDEEMED',
            message: 'Voucher has been redeem',
        },
        max_probabilities: {
            code: 'MAX_PROBABILITIES',
            message: 'Generate code voucher failed, please try again',
        },
        code_not_found: {
            code: 'CODE_NOT_FOUND',
            message: 'Code not found.',
        },
        already_used: {
            code: 'ALREADY_USED',
            message: 'Voucher has been used.',
        },
        invalid_store: {
            code: 'STORE_INVALID',
            message: 'Voucher cannot be use in this store',
        },
        store_required: {
            code: 'STORE_REQUIRED',
            message: 'Voucher need an id store',
        },
    },
    quota: {
        max_limit: {
            code: 'MAX_LIMIT',
            message: 'Quota limited',
        },
        less_than_redeemed: {
            code: 'LESS_THAN_REDEEMED',
            message: 'Quota must not be lesser than total voucher redeemed',
        },
    },
    point: {
        insufficient: {
            code: 'INSUFFICIENT',
            message: 'Insufficient Point',
        },
        exist: {
            code: 'POINT_EXIST',
            message: 'Point is exist.',
        },
    },
    start_date: {
        exist: {
            code: 'START_DATE_EXIST',
            message: 'Start Date is exist.',
        },
    },
    end_date: {
        exist: {
            code: 'END_DATE_EXIST',
            message: 'End Date is exist.',
        },
    },
    type: {
        exist: {
            code: 'TYPE_EXIST',
            message: 'Reward Type is exist.',
        },
    },
    name: {
        exist: {
            code: 'NAME_EXIST',
            message: 'Reward Name is exist.',
        },
    },
};
//# sourceMappingURL=catalog_redemption.js.map