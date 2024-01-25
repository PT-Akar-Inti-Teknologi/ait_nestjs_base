import { PartialType } from '@nestjs/mapped-types';
import { CreateAuditTrailDto } from './create-audit_trail.dto';

export class UpdateAuditTrailDto extends PartialType(CreateAuditTrailDto) {}
