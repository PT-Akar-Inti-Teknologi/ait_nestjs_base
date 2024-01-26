import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberDocument } from './member.entity';

@Entity('members_addresses')
@Index(['postal_code_id', 'address'])
export class MemberAddressDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MemberDocument, (member) => member.addresses, {
    nullable: false,
  })
  @JoinColumn({ name: 'member_id' })
  member: MemberDocument;

  @Column('uuid')
  member_id: string;

  @Column('uuid', { nullable: true })
  postal_code_id: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Column({ default: false, nullable: false })
  is_main: boolean;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at: Date;
}
