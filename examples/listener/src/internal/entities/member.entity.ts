import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
  IsOptional,
  IsIn,
} from 'class-validator';

import { BaseEntityInternal } from './base.entity';
import { MemberAddressDocument } from './member-address.entity';
import { EntityName, EnumGender, ValidationGroup } from '../internal.constant';

@Entity(EntityName.MEMBERS)
export class MemberDocument extends BaseEntityInternal {
  @Column({ length: 100, default: `000000` })
  no_member: string;

  @IsNotEmpty({ groups: ValidationGroup.INSERT })
  @IsString({ groups: ValidationGroup.INSERT })
  @MinLength(1, { groups: ValidationGroup.INSERT })
  @Column({ length: 100, nullable: false })
  name: string;

  @IsOptional({ groups: ValidationGroup.INSERT })
  @IsString({ groups: ValidationGroup.INSERT })
  @MinLength(1, { groups: ValidationGroup.INSERT })
  @Column({ length: 50, nullable: true })
  email: string;

  @IsNotEmpty({ groups: ValidationGroup.INSERT })
  @IsString({ groups: ValidationGroup.INSERT })
  @MinLength(1, { groups: ValidationGroup.INSERT })
  @Column({ length: 14, nullable: false })
  phone: string;

  @IsOptional({ groups: ValidationGroup.INSERT })
  @IsIn(Object.values(EnumGender), { groups: ValidationGroup.INSERT })
  @Column({ type: 'enum', enum: EnumGender, nullable: true })
  gender: EnumGender;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => MemberAddressDocument, (address) => address.member, {
    cascade: true,
  })
  addresses: MemberAddressDocument[];

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_never_expired: number;

  /** Point */
  @IsInt()
  @Column({ default: 0 })
  point: number;
}
