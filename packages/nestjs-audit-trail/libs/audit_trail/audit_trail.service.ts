import { Injectable } from '@nestjs/common';
import {
  AuditTrail,
  AuditTrailDocument,
} from './entities/audit_trail_request.entity';
import { MessageService, ResponseService } from '@ait/nestjs-base';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongoBaseService } from '../base/abstract-base/service/mongo-service.base';
import { AitAuditTrailConfig } from './interfaces/audit_trail_config.interface';
import { GetAuditTrailDTO } from './dto/get-audit-trail.dto';

@Injectable()
export class AuditTrailService extends MongoBaseService<
  AuditTrail,
  AuditTrail,
  AuditTrailDocument,
  GetAuditTrailDTO
> {
  constructor(
    @InjectModel(AuditTrail.name)
    private auditTrailRepository: Model<AuditTrailDocument>,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
    private readonly config: AitAuditTrailConfig,
  ) {
    super(
      auditTrailRepository,
      responseService,
      messageService,
      AuditTrailService.name,
    );

    this.searchByFields = [];
    this.filterByFields = {
      logical_operator: 'AND',
      conditions: [
        {
          field: `created_by`,
          comparator: 'IN',
          key: 'user_ids',
        },
        {
          logical_operator: 'AND',
          conditions: [
            {
              field: `created_at`,
              comparator: '>=',
              key: 'start_date',
            },
            {
              field: `created_at`,
              comparator: '<=',
              key: 'end_date',
            },
          ],
        },
      ],
    };
  }

  public save(createDTO: AuditTrail): Promise<AuditTrailDocument> {
    const cloneDTO = structuredClone(createDTO);
    this.removeIgnoredFields(cloneDTO.request);
    this.removeIgnoredFields(cloneDTO.response);
    this.removeIgnoredFields(cloneDTO.changes);
    return super.save(cloneDTO);
  }

  public removeIgnoredArrayFields(fields: []) {
    for (const value of fields) {
      if (Array.isArray(value)) {
        this.removeIgnoredArrayFields(value);
      } else if (typeof value === 'object' && value != null) {
        this.removeIgnoredFields(value);
      }
    }
  }

  public removeIgnoredFields(fields: Record<string, any>) {
    const keys = Object.keys(fields);
    for (const key of keys) {
      if (this.isKeyIgnored(key)) {
        delete fields[key];
      } else if (Array.isArray(fields[key])) {
        this.removeIgnoredArrayFields(fields[key]);
      } else if (typeof fields[key] === 'object' && fields[key] != null) {
        this.removeIgnoredFields(fields[key]);
      }
    }
  }

  public isKeyIgnored(key: string): boolean {
    for (const ignore of this.config.ignores) {
      if (typeof ignore == 'string') {
        if (key == ignore) return true;
      } else if (ignore.test(key)) {
        return true;
      }
    }
    return false;
  }
}
