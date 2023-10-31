import { IUser } from '../interface/user.interface';
import { AuthPermissionsService } from '../../../replication-data/permissions/auth-permissions.service';
import { AitAuthConfig } from '../interface/auth-config.interface';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authPermissionsService;
    constructor(authPermissionsService: AuthPermissionsService, aitAuthConfig: AitAuthConfig);
    validate(payload: IUser): Promise<IUser>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map