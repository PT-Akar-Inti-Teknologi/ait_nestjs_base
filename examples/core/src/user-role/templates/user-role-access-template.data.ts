import { AccessTemplateInterface } from '../interfaces/access-template.interface';
import { AccessActionEnum } from '../enums/access-action.enum';

export const defaultAccess = [
  AccessActionEnum.CREATE,
  AccessActionEnum.DELETE,
  AccessActionEnum.UPDATE,
  AccessActionEnum.READ,
];

export const accessTemplate: AccessTemplateInterface[] = [
  generateTemplate('Dashboard', 'DASHBOARD', defaultAccess),
  generateTemplate('Permissions', 'PERMISSION', defaultAccess, [
    generateTemplate('All Users', 'ALL_USERS', defaultAccess),
    generateTemplate('User Roles', 'USER_ROLES', defaultAccess),
  ]),
  generateTemplate('Home Menu', 'HOME_MENU', defaultAccess),
  generateTemplate('Manage Banner', 'MANAGE_BANNER', defaultAccess, [
    generateTemplate('Category', 'CATEGORY', defaultAccess),
    generateTemplate('List', 'LIST', defaultAccess),
  ]),
];

export function generateTemplate(
  name: string,
  code: string,
  permissions: string[],
  sub_modules: AccessTemplateInterface[] = [],
): AccessTemplateInterface {
  return {
    name,
    code,
    permissions,
    sub_modules,
  };
}
