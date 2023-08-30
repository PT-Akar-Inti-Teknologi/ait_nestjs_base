import { Strategy } from 'passport-jwt';
import { IUser } from '../interface/user.interface';
import { AuthPermissionsService } from '../../permissions/auth-permissions.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authPermissionsService;
    constructor(authPermissionsService: AuthPermissionsService);
    validate(payload: IUser): Promise<IUser>;
}
export {};
