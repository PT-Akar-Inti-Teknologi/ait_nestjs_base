import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleModulePermissionsDocument } from './role-module-permissions.entity';
import { ModuleGroupDocument } from './module-group.entity';

@Entity({ name: 'module_permissions' })
export class ModulePermissionsDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  group_code: string;

  @ManyToOne(() => ModuleGroupDocument, (group) => group.code)
  @JoinColumn({ name: 'group_code' })
  group: ModuleGroupDocument;

  @Column({ type: 'json', default: [] })
  permissions: string[];

  @OneToMany(
    () => RoleModulePermissionsDocument,
    (model) => model.module_permission,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  role_module_permissions: RoleModulePermissionsDocument[];

  @Column({ nullable: false, default: 999 })
  sequence: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | string;
}
