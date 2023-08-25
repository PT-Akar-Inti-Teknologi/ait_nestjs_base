import { ResponseDTO } from './response.dto';
export declare class ResponseSuccessSingleDTO extends ResponseDTO {
    readonly response_output: {
        detail: any;
    };
    static Builder(): import("builder-pattern").IBuilder<ResponseSuccessSingleDTO>;
}
