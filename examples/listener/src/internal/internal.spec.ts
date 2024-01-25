import { v4 } from 'uuid';
import request from 'supertest';
import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { InternalService } from './internal.service';
import { InternalController } from './internal.controller';
import { BASE_PATH, EntityName } from './internal.constant';

import { CountryDocument } from './entities/countries.entity';
import { ProvinceDocument } from './entities/provinces.entity';
import { CityDocument } from './entities/cities.entity';
import { PostalCodeDocument } from './entities/postal-codes.entity';
import { MemberAddressDocument } from './entities/member-address.entity';
import { MemberDocument } from './entities/member.entity';
import { MerchantDocument } from './entities/merchant.entity';
import { StoreDocument } from './entities/store.entity';
import { TransactionDocument } from './entities/transactions.entity';

import { ignoreRelationsOf, mockModules } from '../test/test-utils';

/**
 * Test Suite
 * - Controller E2E and Unit Test
 * - Service with Unit Test
 */
describe('Internal Module', () => {
  let [module, app]: [TestingModule, INestApplication] = [null, null];

  beforeAll(async () => {
    [module, app] = await mockModules(
      {
        controllers: [InternalController],
        providers: [InternalService],
      },
      {
        entities: [
          CountryDocument,
          ProvinceDocument,
          CityDocument,
          PostalCodeDocument,
          MemberAddressDocument,
          ignoreRelationsOf(MemberDocument, [
            'addresses',
            'tier',
            'qualification_criteria',
          ]),
          MerchantDocument,
          StoreDocument,
          TransactionDocument,
        ],
      },
    );
  });

  /**
   * Create api path by entityName
   * and define payload of each
   * and provide container to set response
   * which can be reusable by relation or api update/delete
   */
  function createConfigPayload() {
    const config = {
      [EntityName.COUNTRIES]: {
        response: null as Record<string, any>,
        getPayload: () => ({ name: 'Indonesia' }),
      },
      [EntityName.PROVINCES]: {
        response: null as Record<string, any>,
        getPayload: () => ({
          name: 'Daerah Istimewa Yogyakarta',
          country: { id: config[EntityName.COUNTRIES].response.id },
        }),
      },
      [EntityName.CITIES]: {
        response: null as Record<string, any>,
        getPayload: () => ({
          name: 'Bantul',
          province: { id: config[EntityName.PROVINCES].response.id },
        }),
      },
      [EntityName.POSTAL_CODES]: {
        response: null as Record<string, any>,
        getPayload: () => ({
          postal_code: '55143',
          city: { id: config[EntityName.CITIES].response.id },
        }),
      },
      [EntityName.MEMBERS]: {
        response: null as Record<string, any>,
        getPayload: () => ({
          no_member: '12345',
          name: 'Fajar',
          email: 'nurrahman.fajar@akarinti.tech',
          phone: '8973506312',
          gender: 'MALE',
        }),
      },
      [EntityName.MEMBERS_ADDRESSES]: {
        response: null as Record<string, any>,
        getPayload: () => ({
          address: 'Jogja Tamanan',
          is_main: true,
          member: { id: config[EntityName.MEMBERS].response.id },
          postal_code: { id: config[EntityName.POSTAL_CODES].response.id },
        }),
      },
      [EntityName.MERCHANTS]: {
        response: null as Record<string, any>,
        getPayload: () => ({ name: 'Kopiku' }),
      },
      [EntityName.STORES]: {
        response: null as Record<string, any>,
        getPayload: () => ({ name: 'Pawon Grojog' }),
      },
      [EntityName.TRANSACTIONS]: {
        response: null as Record<string, any>,
        getPayload: () => ({
          order_number: v4(),
          member: { id: config[EntityName.MEMBERS].response.id },
          store: { id: config[EntityName.STORES].response.id },
          grand_total: 10000,
        }),
      },
    };

    return config;
  }

  /**
   * Expect test and set response into container
   * of each entityName ConfigPayload {@link createConfigPayload}
   * @param result
   * @param configContainer
   * @param done
   */
  function expectAndSetResponse(
    result: Record<any, any>,
    configContainer: any,
    done: () => void,
  ) {
    expect(result).not.toBeUndefined();

    const body: Record<any, any> = result.body ? result.body : result;
    expect(body).not.toBeUndefined();
    expect(body.response_output).not.toBeUndefined();
    expect(body.response_output.detail).not.toBeUndefined();

    configContainer.response = body.response_output.detail;

    done();
  }

  describe('Controller', () => {
    let controller: InternalController;

    it('Should be defined', () => {
      controller = module.get(InternalController);

      expect(controller).toBeDefined();
    });

    describe('E2E Test', () => {
      const config = createConfigPayload();

      describe('Add', () => {
        Object.keys(config).forEach((entityName) => {
          it(entityName, async (done) => {
            expectAndSetResponse(
              await request(app.getHttpServer())
                .post(`${BASE_PATH}/${entityName}`)
                .send(config[entityName].getPayload()),
              config[entityName],
              done,
            );
          });
        });
      });

      describe('Update', () => {
        Object.keys(config).forEach((entityName) => {
          it(entityName, async (done) => {
            expectAndSetResponse(
              await request(app.getHttpServer())
                .put(
                  `${BASE_PATH}/${entityName}/${config[entityName].response.id}`,
                )
                .send(config[entityName].getPayload()),
              config[entityName],
              done,
            );
          });
        });
      });

      describe('Delete', () => {
        Object.keys(config)
          .reverse()
          .forEach((entityName) => {
            it(entityName, async (done) => {
              expectAndSetResponse(
                await request(app.getHttpServer()).delete(
                  `${BASE_PATH}/${entityName}/${config[entityName].response.id}`,
                ),
                config[entityName],
                done,
              );
            });
          });
      });
    });

    describe('Unit Test', () => {
      const config = createConfigPayload();

      describe('Add', () => {
        Object.keys(config).forEach((entityName) => {
          it(entityName, async (done) => {
            expectAndSetResponse(
              await controller.add(
                entityName as EntityName,
                config[entityName].getPayload(),
              ),
              config[entityName],
              done,
            );
          });
        });
      });

      describe('Update', () => {
        Object.keys(config).forEach((entityName) => {
          it(entityName, async (done) => {
            expectAndSetResponse(
              await controller.update(
                entityName as EntityName,
                config[entityName].response.id,
                config[entityName].getPayload(),
              ),
              config[entityName],
              done,
            );
          });
        });
      });

      describe('Delete', () => {
        Object.keys(config)
          .reverse()
          .forEach((entityName) => {
            it(entityName, async (done) => {
              expectAndSetResponse(
                await controller.delete(
                  entityName as EntityName,
                  config[entityName].response.id,
                ),
                config[entityName],
                done,
              );
            });
          });
      });
    });
  });

  describe('Service', () => {
    let service: InternalService;

    it('Should be defined', () => {
      service = module.get(InternalService);

      expect(service).toBeDefined();
    });

    describe('Unit Test', () => {
      const config = createConfigPayload();

      describe('Add', () => {
        Object.keys(config).forEach((entityName) => {
          it(entityName, async (done) => {
            expectAndSetResponse(
              await service.add(
                entityName as EntityName,
                config[entityName].getPayload(),
              ),
              config[entityName],
              done,
            );
          });
        });
      });

      describe('Update', () => {
        Object.keys(config).forEach((entityName) => {
          it(entityName, async (done) => {
            expectAndSetResponse(
              await service.update(
                entityName as EntityName,
                config[entityName].response.id,
                config[entityName].getPayload(),
              ),
              config[entityName],
              done,
            );
          });
        });
      });

      describe('Delete', () => {
        Object.keys(config)
          .reverse()
          .forEach((entityName) => {
            it(entityName, async (done) => {
              expectAndSetResponse(
                await service.delete(
                  entityName as EntityName,
                  config[entityName].response.id,
                ),
                config[entityName],
                done,
              );
            });
          });
      });
    });
  });
});
