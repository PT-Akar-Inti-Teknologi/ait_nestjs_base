import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessageService, ResponseService } from '@pt-akar-inti-teknologi/nestjs-base';
import { AuditTrailChildService } from './audit-trail-child.service';
import { GetAuditTrailDTO } from '@pt-akar-inti-teknologi/nestjs-audit-trail';
@Controller('api/v1/core/audit-trail')
export class AuditTrailController {
  constructor(
    private readonly auditTrailService: AuditTrailChildService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  @Get()
  async findAll(@Query() getAuditTrailDTO: GetAuditTrailDTO) {
    const result = await this.auditTrailService.findAll(getAuditTrailDTO);
    return this.responseService.successCollection(
      result.content,
      result.pagination,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditTrailService.getAndValidateById(id);
  }
}
