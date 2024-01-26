export const BASE_PATH = '/api/v1/internal/listener';
export const TABLE_PREFIX = 'loyalties';

export const ValidationGroup = {
  INSERT: ['insert'],
  UPDATE: ['update'],
  ALL: ['insert', 'update'],
};

export enum EntityName {
  MEMBERS = 'members',
  MEMBERS_ADDRESSES = 'members_addresses',
}

export enum EnumGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum EnumStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  FINISHED = 'FINISHED',
}
