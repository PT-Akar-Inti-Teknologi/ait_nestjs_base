import { SetMetadata } from '@nestjs/common';

export const SuperadminBypass = (superadminBypass: boolean = true) =>
  SetMetadata('superadmin_bypass', superadminBypass);
