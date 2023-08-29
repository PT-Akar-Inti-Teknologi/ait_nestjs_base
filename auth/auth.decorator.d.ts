export declare function AuthJwtGuard(): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare const User: (...dataOrPipes: (string | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
export declare function Response(): (target: Record<string, any>, key: string | symbol | boolean, index?: number) => void;
export declare function Message(): (target: Record<string, any>, key: string | symbol, index?: number) => void;
