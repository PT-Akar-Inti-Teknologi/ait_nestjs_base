import { PaginationDTO } from './pagination.dto';
export declare class ListPaginationDTO {
    readonly pagination: PaginationDTO;
    readonly content: any[];
    static Builder(): import("builder-pattern").IBuilder<ListPaginationDTO>;
}
