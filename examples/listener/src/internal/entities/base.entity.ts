import { Exclude } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class BaseEntityInternal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude({ toClassOnly: true })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Exclude({ toClassOnly: true })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Exclude({ toClassOnly: true, toPlainOnly: true })
  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deleted_at: Date;
}
