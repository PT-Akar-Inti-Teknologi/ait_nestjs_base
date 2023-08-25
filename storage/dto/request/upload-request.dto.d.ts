/// <reference types="node" />
export declare class UploadRequestDto {
    buffer: Buffer;
    path: string;
    filename: string;
    static Builder(): import("builder-pattern").IBuilder<UploadRequestDto>;
}
