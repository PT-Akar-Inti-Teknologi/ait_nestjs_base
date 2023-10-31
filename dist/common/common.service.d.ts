import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
export declare class CommonService {
    private httpService;
    constructor(httpService: HttpService);
    postHttp(url: string, body?: Record<string, any>, headers?: Record<string, any>): Promise<AxiosResponse<any>>;
    getHttp(url: string): Promise<AxiosResponse<any>>;
    deleteHttp(url: string, headers?: Record<string, any>): Promise<any>;
}
//# sourceMappingURL=common.service.d.ts.map