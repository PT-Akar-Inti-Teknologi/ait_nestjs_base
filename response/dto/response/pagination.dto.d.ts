export declare class PaginationDTO {
    readonly page: number;
    readonly total: number;
    readonly size: number;
    static Builder(): import("builder-pattern").IBuilder<PaginationDTO>;
}
