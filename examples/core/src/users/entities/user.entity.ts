import { AitBaseEntity } from '@ait/nestjs-base';
import { RolesDocument } from 'src/user-role/entities/roles.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserDocument extends AitBaseEntity {
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
}
