/// <reference types="node" />
export declare class UploadRequest {
    buffer: Buffer;
    path: string;
    filename: string;
    static Builder(): import("builder-pattern").IBuilder<UploadRequest>;
}
