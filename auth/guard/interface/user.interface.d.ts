export declare enum IUserType {
    Customer = "customer",
    Merchant = "merchant",
    Admin = "admin",
    Superadmin = "superadmin"
}
export declare enum ILevel {
    Group = "group",
    Merchant = "merchant",
    Store = "store"
}
export interface IUser {
    id: string;
    user_type: IUserType;
    role_id: string;
    level: ILevel;
    permissions: string[];
}
