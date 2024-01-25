import { RolesDocument } from 'src/user-role/entities/roles.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export enum EnumMainBannersStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  FINISHED = 'FINISHED',
}

@Entity({
  name: `permissions`,
})
@Index(['role_id'])
export class PermissionDocument {
  @PrimaryColumn()
  role_id: string;

  @OneToOne(() => RolesDocument, (model) => model.permissions)
  @JoinColumn({ name: 'role_id' })
  role: RolesDocument;

  @Column({ type: 'json', default: [] })
  permissions: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | string;
}
