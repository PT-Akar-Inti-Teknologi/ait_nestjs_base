import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AuditTrailDocument = HydratedDocument<AuditTrail>;

export interface AuditTrailManualChange {
  /** entity class, pass the class definition, not the object, example: `SomeEntity` */
  entityClass: Type;
  /** old value, can be undefined */
  old_value?: any;
  /** new value, can be undefined */
  current_value?: any;
}

export class AuditTrailChanges {
  @Prop({ required: false, index: true })
  table: string;

  @Prop({ required: false, index: true, type: mongoose.Schema.Types.Mixed })
  old_value: any;

  @Prop({ required: true, index: true, type: mongoose.Schema.Types.Mixed })
  current_value: any;

  @Prop({ required: false })
  created_at: Date;

  @Prop({ required: false })
  expired_at: Date;
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'admins_audit_trail',
})
export class AuditTrail {
  @Prop({ required: false })
  cms_request_id: string;

  @Prop({ required: true })
  request_id: string;

  @Prop({ required: false, index: true })
  user_action: string;

  @Prop({ required: false, index: true })
  menu: string;

  @Prop({ required: false })
  changes: AuditTrailChanges[];

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  request: any;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  response: any;

  @Prop({ required: true })
  created_by: string;

  @Prop({ required: false })
  created_at: Date;

  @Prop({ required: false })
  updated_at: Date;

  @Prop({ required: false })
  expired_at: Date;
}

export const AuditTrailSchema = SchemaFactory.createForClass(AuditTrail);
