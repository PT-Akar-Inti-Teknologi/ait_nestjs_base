import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleModulePermissionDTO } from './role-module-permisions.dto';

export class CreateUserRolesDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;

  @IsNotEmpty()
  roles_module_permissions: RoleModulePermissionDTO[];
}
