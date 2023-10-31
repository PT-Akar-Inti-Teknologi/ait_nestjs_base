import { PermissionDocument } from '../../permissions/entities/permission.entity';
export declare class RolesDTO {
    id: string;
    permissions: PermissionDocument;
}
export declare class SaveAdminsUserDTO {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role_id: string;
    is_active: boolean;
    is_superadmin: boolean;
    role: RolesDTO;
}
//# sourceMappingURL=save-admins-user.dto.d.ts.map