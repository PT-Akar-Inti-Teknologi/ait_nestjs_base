import { PartialType } from '@nestjs/mapped-types';
import CreatePermissionDTO from './save-permission.dto';

export class UpdatePermissionDTO extends PartialType(CreatePermissionDTO) {}
