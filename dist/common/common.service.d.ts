import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ResponseService } from '../response/response.service';
export declare class CommonService {
    private httpService;
    private responseService;
    constructor(httpService: HttpService, responseService: ResponseService);
    postHttp(url: string, body?: Record<string, any>, headers?: Record<string, any>): Promise<AxiosResponse<any>>;
    getHttp(url: string): Promise<AxiosResponse<any>>;
    deleteHttp(url: string, headers?: Record<string, any>): Promise<any>;
    broadcastUpdate(body: Record<string, any>, sufixUrl: string, prefixUrl?: string): Promise<void>;
    broadcastDelete(id: string, sufixUrl: string, prefixUrl?: string): Promise<void>;
}
//# sourceMappingURL=common.service.d.ts.map