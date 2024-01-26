import { Test, TestingModule } from '@nestjs/testing';
import { AuditTrailController } from './audit-trail.controller';
import { AuditTrailChildService } from './audit-trail-child.service';
import { MessageService, ResponseService } from '@ait/nestjs-base';

describe('AuditTrailController', () => {
  let controller: AuditTrailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditTrailController],
      providers: [
        MessageService,
        ResponseService,
        {
          provide: AuditTrailChildService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuditTrailController>(AuditTrailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
