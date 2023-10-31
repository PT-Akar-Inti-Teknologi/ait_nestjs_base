declare const _default: {
    additional_points: {
        point: {
            insufficient_points: {
                code: string;
                message: string;
            };
        };
    };
    general: {
        create: {
            success: {
                code: string;
                message: string;
            };
            fail: {
                code: string;
                message: string;
            };
        };
        update: {
            success: {
                code: string;
                message: string;
            };
            fail: {
                code: string;
                message: string;
            };
        };
        list: {
            success: {
                code: string;
                message: string;
            };
            fail: {
                code: string;
                message: string;
            };
        };
        delete: {
            success: {
                code: string;
                message: string;
            };
            fail: {
                code: string;
                message: string;
            };
        };
        get: {
            success: {
                code: string;
                message: string;
            };
            fail: {
                code: string;
                message: string;
            };
        };
        general: {
            success: {
                code: string;
                message: string;
            };
            data_success: {
                code: string;
                message: string;
            };
            fail: {
                code: string;
                message: string;
            };
            data_not_found: {
                code: string;
                message: string;
            };
            id_not_found: {
                code: string;
                message: string;
            };
            value_exist: {
                code: string;
                message: string;
            };
            name_exist: {
                code: string;
                message: string;
            };
            phone_exist: {
                code: string;
                message: string;
            };
            email_exist: {
                code: string;
                message: string;
            };
            title_exist: {
                code: string;
                message: string;
            };
            period_exist: {
                code: string;
                message: string;
            };
            no_member_exist: {
                code: string;
                message: string;
            };
            store_id_exist: {
                code: string;
                message: string;
            };
            tier_from_id_exist: {
                code: string;
                message: string;
            };
            tier_to_id_exist: {
                code: string;
                message: string;
            };
            data_invalid: {
                code: string;
                message: string;
            };
            data_is_empty: {
                code: string;
                message: string;
            };
            data_not_allowed: {
                code: string;
                message: string;
            };
            invalid_user_access: {
                code: string;
                message: string;
            };
            status_not_allowed: {
                code: string;
                message: string;
            };
            image_not_modified: {
                code: string;
                message: string;
            };
            invalid_date: {
                code: string;
                message: string;
            };
            invalid_start_end_date: {
                code: string;
                message: string;
            };
            invalid_greater_date: {
                code: string;
                message: string;
            };
            date_is_exist: {
                code: string;
                message: string;
            };
            date_overlap: {
                code: string;
                message: string;
            };
            date_period_invalid: {
                code: string;
                message: string;
            };
            empty_photo: {
                code: string;
                message: string;
            };
            is_scheduled: {
                code: string;
                message: string;
            };
            is_ongoing_or_past: {
                code: string;
                message: string;
            };
        };
        redis: {
            create_queue_fail: {
                code: string;
                message: string;
            };
        };
    };
    auth: {
        token: {
            invalid_token: {
                code: string;
                message: string;
            };
            invalid_refresh_token: {
                code: string;
                message: string;
            };
            expired_token: {
                code: string;
                message: string;
            };
            create_token_failed: {
                code: string;
                message: string;
            };
            forbidden: {
                code: string;
                message: string;
            };
        };
        role_id: {
            invalid_role_id: {
                code: string;
                message: string;
            };
        };
    };
    file: {
        image: {
            not_allowed: {
                code: string;
                message: string;
            };
        };
        error: {
            is_required: {
                code: string;
                message: string;
            };
        };
    };
    login: {
        email: {
            unregistered_email: {
                code: string;
                message: string;
            };
            invalid: {
                code: string;
                message: string;
            };
        };
        account: {
            inactive: {
                code: string;
                message: string;
            };
        };
        password: {
            invalid_password: {
                code: string;
                message: string;
            };
        };
    };
    user: {
        user_id: {
            exist: {
                code: string;
                message: string;
            };
            not_found: {
                code: string;
                message: string;
            };
        };
        user_ids: {
            not_found: {
                code: string;
                message: string;
            };
        };
        email: {
            already_used: {
                code: string;
                message: string;
            };
        };
        password: {
            invalid_password: {
                code: string;
                message: string;
            };
            same_as_old_password: {
                code: string;
                message: string;
            };
        };
    };
    group: {
        phone: {
            exist: {
                code: string;
                message: string;
            };
        };
        id: {
            not_found: {
                code: string;
                message: string;
            };
            invalid_id: {
                code: string;
                message: string;
            };
        };
    };
    catalog_redemption: {
        product_id: {
            empty: {
                code: string;
                message: string;
            };
            exist: {
                code: string;
                message: string;
            };
        };
        period: {
            expired: {
                code: string;
                message: string;
            };
            not_active: {
                code: string;
                message: string;
            };
        };
        voucher: {
            redeemed: {
                code: string;
                message: string;
            };
            max_probabilities: {
                code: string;
                message: string;
            };
            code_not_found: {
                code: string;
                message: string;
            };
            already_used: {
                code: string;
                message: string;
            };
            invalid_store: {
                code: string;
                message: string;
            };
            store_required: {
                code: string;
                message: string;
            };
        };
        quota: {
            max_limit: {
                code: string;
                message: string;
            };
            less_than_redeemed: {
                code: string;
                message: string;
            };
        };
        point: {
            insufficient: {
                code: string;
                message: string;
            };
            exist: {
                code: string;
                message: string;
            };
        };
        start_date: {
            exist: {
                code: string;
                message: string;
            };
        };
        end_date: {
            exist: {
                code: string;
                message: string;
            };
        };
        type: {
            exist: {
                code: string;
                message: string;
            };
        };
        name: {
            exist: {
                code: string;
                message: string;
            };
        };
    };
    tier_benefit: {
        birthday_generate_benefit_on: {
            empty: {
                code: string;
                message: string;
            };
        };
        type: {
            exist: {
                code: string;
                message: string;
            };
        };
        status: {
            exist: {
                code: string;
                message: string;
            };
        };
        tier_id: {
            exist: {
                code: string;
                message: string;
            };
        };
    };
    graduation_points: {
        tier_to_id: {
            invalid: {
                code: string;
                message: string;
            };
            pair_exist: {
                code: string;
                message: string;
            };
        };
    };
    earning_campaign: {
        start_date: {
            exist: {
                code: string;
                message: string;
            };
        };
        end_date: {
            exist: {
                code: string;
                message: string;
            };
        };
        earning_rate: {
            exist: {
                code: string;
                message: string;
            };
        };
        reserve_rate: {
            exist: {
                code: string;
                message: string;
            };
        };
        store_ids: {
            exist: {
                code: string;
                message: string;
            };
        };
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map