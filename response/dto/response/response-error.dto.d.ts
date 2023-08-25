import { ResponseDTO } from './response.dto';
import { ErrorMessageDTO } from './error-message.dto';
export declare class ResponseErrorDTO extends ResponseDTO {
    readonly response_output: {
        errors: ErrorMessageDTO[];
    };
    static Builder(): import("builder-pattern").IBuilder<ResponseErrorDTO>;
}
