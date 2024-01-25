import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberAddressDocument } from './member-address.entity';

export enum EnumGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity('members')
export class MemberDocument {
  static readonly PREFIX_NO_MEMBER = 'M';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, default: `000000` })
  no_member: string;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 50, nullable: false })
  email: string;

  @Column({ select: false, default: '' })
  password: string;

  @Column({ length: 14, nullable: false })
  phone: string;

  @Column({ type: 'enum', enum: EnumGender, nullable: false })
  gender: EnumGender;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => MemberAddressDocument, (address) => address.member)
  addresses: MemberAddressDocument[];

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at: Date;
}
