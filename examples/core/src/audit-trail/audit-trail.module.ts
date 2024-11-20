import { Global, Module } from '@nestjs/common';
import { AuditTrail, AuditTrailSchema } from '@pt-akar-inti-teknologi/nestjs-audit-trail';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { AuditTrailChildService } from './audit-trail-child.service';
import { AuditTrailController } from './audit-trail.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditTrail.name, schema: AuditTrailSchema },
    ]),
    UsersModule,
  ],
  controllers: [AuditTrailController],
  providers: [AuditTrailChildService],
  exports: [AuditTrailChildService],
})
export class AuditTrailModule {}
