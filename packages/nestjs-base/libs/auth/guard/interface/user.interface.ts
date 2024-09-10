export enum IUserType {
  Customer = 'customer',
  Merchant = 'merchant',
  Admin = 'admin',
  Superadmin = 'superadmin',
}

export enum ILevel {
  Group = 'group',
  Merchant = 'merchant',
  Store = 'store',
}

export interface IUser<
  UserType extends string = IUserType,
  Level extends string = ILevel,
> {
  aud?: string[];
  id: string;
  user_type: UserType;
  role_id: string;
  level: Level;
  permissions: string[];
  organization_id?: string;
}
