import { AuditTrailDocument } from '@pt-akar-inti-teknologi/nestjs-audit-trail';
import { UserDocument } from 'src/users/entities/user.entity';

export interface IAuditTrailExtended extends AuditTrailDocument {
  created_by_admin_user?: UserDocument;
}
