import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { ResponseService } from '../response/response.service';
import { IUser } from './guard/interface/user.interface';
import { MessageService } from '../message/message.service';
import { AitAuthConfig } from './guard/interface/auth-config.interface';
export declare class AuthService {
    private readonly messageService;
    private readonly responseService;
    private httpService;
    private readonly jwtService;
    private readonly aitAuthConfig;
    constructor(messageService: MessageService, responseService: ResponseService, httpService: HttpService, jwtService: JwtService, aitAuthConfig: AitAuthConfig);
    postHttp(url: string, body: Record<string, any>, msgHandler: Record<string, any>): Promise<Observable<AxiosResponse<any>>>;
    createAccessToken(payload: Record<string, any>): Promise<string>;
    createAccessRefreshToken(payload: Record<string, any>): Promise<string>;
    validateAccessToken(token: string): Promise<Record<string, any>>;
    checkExpirationTime(otptime: Date, exptime: number): Promise<boolean>;
    jwtSign(payload: Record<string, any>, expiredIn: string): Promise<string>;
    jwtVerify(token: string): Promise<boolean>;
    jwtPayload(token: string, ignoreExpiration?: boolean): Promise<Record<string, any>>;
    generateToken(user: IUser): Promise<{
        token: string;
        refreshtoken: string;
    }>;
    generateAccessToken(user: IUser): Promise<string>;
}
//# sourceMappingURL=auth.service.d.ts.map