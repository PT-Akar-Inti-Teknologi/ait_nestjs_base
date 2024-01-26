import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModulePermissionsDocument } from './module-permissions.entity';

@Entity({ name: 'module_groups' })
export class ModuleGroupDocument {
  @PrimaryColumn()
  code: string;

  @OneToMany(() => ModulePermissionsDocument, (model) => model.group_code)
  module_permissions: ModulePermissionsDocument[];

  @Column({ nullable: false })
  name: string;

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
