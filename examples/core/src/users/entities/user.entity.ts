import { RolesDocument } from 'src/user-role/entities/roles.entity';
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

@Entity({ name: 'users' })
export class UserDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ nullable: true, default: null })
  email_verified_at: Date;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  role_id: string;

  @ManyToOne(() => RolesDocument)
  @JoinColumn({ name: 'role_id' })
  role: RolesDocument;

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
