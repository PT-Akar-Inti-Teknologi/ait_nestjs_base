import { AdminsUserDocument } from '../entities/user.entity';

export const dataSuperAdmins: Partial<AdminsUserDocument>[] = [
  {
    id: 'b91eb9e9-db77-49a5-90c1-768a1cd48ada',
    first_name: 'Super Admin',
    last_name: ' ',
    email: 'super@admin.tech',
    is_active: true,
    created_at: '2023-06-26T00:15:44.410Z',
    updated_at: '2023-06-26T00:15:44.410Z',
    deleted_at: null,
    role_id: null,
    is_superadmin: true,
  },
];
