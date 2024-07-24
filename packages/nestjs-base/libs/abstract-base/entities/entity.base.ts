import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity as TypeormBaseEntity } from 'typeorm';

export class AitBaseLiteEntity extends TypeormBaseEntity {
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | string;
}

export class AitBaseEntity extends AitBaseLiteEntity {
  @Column({ type: 'uuid', nullable: true })
  created_by_id: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by_id: string;

  @Column({ type: 'uuid', nullable: true })
  deleted_by_id: string;
}
