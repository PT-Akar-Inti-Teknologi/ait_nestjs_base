import { ResponseDTO } from './response.dto';
import { ListPaginationDTO } from './list-pagination.dto';
export declare class ResponseSuccessCollectionDTO extends ResponseDTO {
    readonly response_output: {
        list: ListPaginationDTO;
    };
    static Builder(): import("builder-pattern").IBuilder<ResponseSuccessCollectionDTO>;
}
