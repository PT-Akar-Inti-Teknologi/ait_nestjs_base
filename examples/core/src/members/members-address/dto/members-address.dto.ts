import { PartialType } from '@nestjs/mapped-types';

export class CreateMembersAddressDTO {}

export class UpdateMembersAddressDTO extends PartialType(
  CreateMembersAddressDTO,
) {}
