import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRolesDTO } from './create-user-roles.dto';

export class UpdateUserRolesDTO extends PartialType(CreateUserRolesDTO) {}
