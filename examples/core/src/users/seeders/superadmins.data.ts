import { UserDocument } from 'src/users/entities/user.entity';

export const dataSuperAdmins: Partial<UserDocument>[] = [
  {
    id: 'b91eb9e9-db77-49a5-90c1-768a1cd48ada',
    first_name: 'Super Admin',
    last_name: ' ',
    email: 'super@admin.tech',
    password: '$2b$10$gI8yOza0BXsk6cZHB1wwMett5A4JrXT7mXuNCXXQuwoOEH9qaR7A6',
    is_active: true,
    created_at: '2023-06-26T00:15:44.410Z',
    updated_at: '2023-06-26T00:15:44.410Z',
    deleted_at: null,
    email_verified_at: null,
    verification_token: '1f0d4119-9987-465c-a1e2-72f0f09f5a19',
    role_id: null,
    is_superadmin: true,
  },
];
