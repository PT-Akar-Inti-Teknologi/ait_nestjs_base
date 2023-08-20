export declare class ResponseDTO {
    readonly response_schema: {
        readonly response_code: string;
        readonly response_message: string;
    };
    readonly response_output: any;
    static Builder(): import("builder-pattern").IBuilder<ResponseDTO>;
}
