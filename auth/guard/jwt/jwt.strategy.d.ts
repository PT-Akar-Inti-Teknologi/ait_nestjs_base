import { Strategy } from 'passport-jwt';
import { IUser } from '../interface/user.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: IUser): Promise<IUser>;
}
export {};
