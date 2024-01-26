import { PartialType } from '@nestjs/mapped-types';
import { SavePermissionDTO } from './save-permission.dto';

export class UpdatePermissionDTO extends PartialType(SavePermissionDTO) {}
