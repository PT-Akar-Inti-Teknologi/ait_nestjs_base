import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleModulePermissionsDocument } from './role-module-permissions.entity';
import { PermissionDocument } from 'src/auth/entities/permission.entity';

export enum EnumRoleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity({ name: 'roles' })
export class RolesDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => RoleModulePermissionsDocument, (model) => model.role, {
    cascade: true,
  })
  roles_module_permissions: RoleModulePermissionsDocument[];

  @OneToOne(() => PermissionDocument, (model) => model.role)
  permissions: PermissionDocument;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | string;
}
