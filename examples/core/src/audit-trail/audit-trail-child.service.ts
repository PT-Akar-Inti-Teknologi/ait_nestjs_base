import { Injectable } from '@nestjs/common';
import {
  ListPaginationInterface,
  MessageService,
  ResponseService,
} from '@ait/nestjs-base';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  AuditTrail,
  AuditTrailDocument,
  AuditTrailService,
  GetAuditTrailDTO,
} from '@ait/nestjs-audit-trail';
import { UsersService } from 'src/users/users.service';
import { isUUID } from 'src/utils/general.utils';
import { logger } from 'nestjs-i18n';
import { IAuditTrailExtended } from './interface/audit-trail-extended.interface';

@Injectable()
export class AuditTrailChildService {
  private auditTrailService: AuditTrailService;

  constructor(
    @InjectModel(AuditTrail.name)
    auditTrailRepository: Model<AuditTrailDocument>,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    private readonly usersService: UsersService,
  ) {
    this.auditTrailService = new AuditTrailService(
      auditTrailRepository,
      responseService,
      messageService,
      {
        ignores: [/password/],
      },
    );
  }

  public async findAll(
    getAuditTrailDTO: GetAuditTrailDTO,
  ): Promise<ListPaginationInterface<AuditTrailDocument>> {
    if (getAuditTrailDTO.end_date) {
      getAuditTrailDTO.end_date = new Date(getAuditTrailDTO.end_date);
    }
    if (getAuditTrailDTO.start_date) {
      getAuditTrailDTO.start_date = new Date(getAuditTrailDTO.start_date);
    }
    const searchUserIds = await this.usersService.getIdsByName(
      getAuditTrailDTO.search,
    );
    if (searchUserIds.length) {
      getAuditTrailDTO.user_ids = searchUserIds;
    }
    const listAduitTrail = await this.auditTrailService.findAll(
      getAuditTrailDTO,
    );
    const userIds = [];
    for (const auditTrail of listAduitTrail.content) {
      if (isUUID(auditTrail.created_by)) {
        userIds.push(auditTrail.created_by);
      }
    }

    if (userIds.length) {
      const users = await this.usersService.getAndValidateByIds(userIds);

      listAduitTrail.content.forEach((auditTrail) => {
        auditTrail['created_by_admin_user'] = users.find(
          ({ id }) => id === auditTrail.created_by,
        );
        return auditTrail;
      });
    }
    return listAduitTrail;
  }

  public async getAndValidateById(id: string): Promise<IAuditTrailExtended> {
    const auditTrail: IAuditTrailExtended = (
      await this.auditTrailService.getAndValidateById(id)
    ).toObject();
    if (isUUID(auditTrail.created_by)) {
      try {
        const adminUser = await this.usersService.getAndValidateByIds([
          auditTrail.created_by,
        ]);
        auditTrail.created_by_admin_user = adminUser[0];
      } catch (error) {
        logger.error(error.message, '', this.constructor.name);
      }
    }
    return auditTrail;
  }
}
