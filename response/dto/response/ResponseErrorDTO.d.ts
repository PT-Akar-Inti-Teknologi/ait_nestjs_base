import { ResponseDTO } from './ResponseDTO';
import { ErrorMessageDTO } from './ErrorMessageDTO';
export declare class ResponseErrorDTO extends ResponseDTO {
    readonly response_output: {
        errors: ErrorMessageDTO[];
    };
    static Builder(): import("builder-pattern").IBuilder<ResponseErrorDTO>;
}
