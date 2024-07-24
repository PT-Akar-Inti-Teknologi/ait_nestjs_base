import { AitBaseEntity, AitBaseLiteEntity } from './entity.base';

class TestLiteClass extends AitBaseLiteEntity {}

class TestClass extends AitBaseEntity {}

describe('AitBaseEntity', () => {
  it('should be able to be identified by its prototype', () => {
    expect(TestClass instanceof Function).toBeTruthy();
    expect(AitBaseEntity.isPrototypeOf(TestClass)).toBeTruthy();
    expect(AitBaseLiteEntity.isPrototypeOf(TestClass)).toBeTruthy();
    expect(TestLiteClass instanceof Function).toBeTruthy();
    expect(AitBaseEntity.isPrototypeOf(TestLiteClass)).toBeFalsy();
    expect(AitBaseLiteEntity.isPrototypeOf(TestLiteClass)).toBeTruthy();
  });
});
