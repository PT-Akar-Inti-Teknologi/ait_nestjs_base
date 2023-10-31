import { PermissionDocument } from '../../permissions/entities/permission.entity';
export declare class AdminsUserDocument {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role_id: string;
    permission: PermissionDocument;
    is_active: boolean;
    is_superadmin: boolean;
    created_at: Date | string;
    updated_at: Date | string;
    deleted_at: Date | string;
}
//# sourceMappingURL=user.entity.d.ts.map