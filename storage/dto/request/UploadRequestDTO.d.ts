/// <reference types="node" />
export declare class UploadRequestDTO {
    buffer: Buffer;
    path: string;
    filename: string;
    static Builder(): import("builder-pattern").IBuilder<UploadRequestDTO>;
}
