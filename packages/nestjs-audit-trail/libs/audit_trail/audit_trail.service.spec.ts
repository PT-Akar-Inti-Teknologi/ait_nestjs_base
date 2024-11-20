import { Test, TestingModule } from '@nestjs/testing';
import { AuditTrailService } from './audit_trail.service';
import { MessageService, ResponseService } from '@pt-akar-inti-teknologi/nestjs-base';
import { AitAuditTrailConfig } from './interfaces/audit_trail_config.interface';
import { getModelToken } from '@nestjs/mongoose';
import { AuditTrail } from './entities';

describe('AuditTrailService', () => {
  let service: AuditTrailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditTrailService,
        ResponseService,
        MessageService,
        {
          provide: AitAuditTrailConfig,
          useValue: {
            ignores: [/password/, 'ignored'],
          },
        },
        {
          provide: getModelToken(AuditTrail.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuditTrailService>(AuditTrailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('removeIgnoredFields should remove fields based on ignores in configurations', () => {
    const obj = {
      password: 'a',
      new_password: 'a',
      ignored: 'b',
      ignored_2: 'b',
      array: [
        'a',
        {
          password: 'a',
          new_password: 'a',
          a: 'b',
        },
      ],
      obj: {
        password: 'a',
        new_password: 'a',
        a: 'b',
      },
    };
    service.removeIgnoredFields(obj);
    expect(obj).toEqual({
      ignored_2: 'b',
      array: [
        'a',
        {
          a: 'b',
        },
      ],
      obj: {
        a: 'b',
      },
    });
  });
});
