import { ResponseDTO } from './ResponseDTO';
export declare class ResponseSuccessSingleDTO extends ResponseDTO {
    readonly response_output: {
        detail: any;
    };
    static Builder(): import("builder-pattern").IBuilder<ResponseSuccessSingleDTO>;
}
