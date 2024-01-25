import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IsBoolean } from 'class-validator';

import { MemberDocument } from './member.entity';
import { BaseEntityInternal } from './base.entity';
import { EntityName, ValidationGroup } from '../internal.constant';

@Index(['postal_code', 'address'])
@Entity(EntityName.MEMBERS_ADDRESSES)
export class MemberAddressDocument extends BaseEntityInternal {
  @ManyToOne(() => MemberDocument)
  @JoinColumn({ name: 'member_id', referencedColumnName: 'id' })
  member: MemberDocument;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @IsBoolean({ groups: ValidationGroup.INSERT })
  @Column({ default: false, nullable: false })
  is_main: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column('uuid', { nullable: true })
  postal_code: string;
}
