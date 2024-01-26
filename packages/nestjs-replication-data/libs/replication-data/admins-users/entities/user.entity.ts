import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionDocument } from '../../permissions/entities/permission.entity';

@Entity({
  name: 'admins_users',
})
@Index(['role_id', 'id'])
export class AdminsUserDocument {
  @PrimaryColumn()
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  role_id: string;

  @ManyToOne(() => PermissionDocument, (permission) => permission.role_id)
  @JoinColumn({ name: 'role_id' })
  permission: PermissionDocument;

  @Column()
  is_active: boolean;

  @Column({ default: false })
  is_superadmin: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | string;
}
