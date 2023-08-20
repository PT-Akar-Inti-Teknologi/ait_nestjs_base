export declare class PaginationRequestDTO {
    page: number;
    size: number;
    search: string;
    sort: string;
    order: 'ASC' | 'DESC';
    static Builder(): import("builder-pattern").IBuilder<PaginationRequestDTO>;
}
