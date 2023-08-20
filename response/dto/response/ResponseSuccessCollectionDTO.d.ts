import { ResponseDTO } from './ResponseDTO';
import { PaginationDTO } from './PaginationDTO';
export declare class ResponseSuccessCollectionDTO<E> extends ResponseDTO {
    readonly response_output: {
        list: {
            pagination: PaginationDTO;
            content: E[];
        };
    };
    static Builder(): import("builder-pattern").IBuilder<ResponseSuccessCollectionDTO<unknown>>;
}
