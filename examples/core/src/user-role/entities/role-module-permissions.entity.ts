import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolesDocument } from './roles.entity';
import { ModulePermissionsDocument } from './module-permissions.entity';

@Entity({ name: 'role_module_permissions' })
export class RoleModulePermissionsDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  role_id: string;

  @ManyToOne(() => RolesDocument, (model) => model.roles_module_permissions)
  @JoinColumn({ name: 'role_id' })
  role: RolesDocument;

  @Column({ nullable: true })
  module_id: string;

  @ManyToOne(
    () => ModulePermissionsDocument,
    (model) => model.role_module_permissions,
  )
  @JoinColumn({ name: 'module_id' })
  module_permission: ModulePermissionsDocument;

  @Column({ type: 'json', default: [] })
  active_permissions: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | string;
}
