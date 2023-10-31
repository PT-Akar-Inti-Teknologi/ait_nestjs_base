/** config needed by Response Service */
export class ResponseServiceConfig {
  /** project name */
  projectName: string;
  /** service name */
  serviceName: string;
}

export interface ErrorMessageInterface {
  readonly field: string;
  readonly message: string;
  readonly code: string;
}
export interface ResponseInterface {
  readonly response_schema: {
    readonly response_code: string;
    readonly response_message: string;
  };
  readonly response_output: any;
}
export interface PaginationInterface {
  readonly page: number;
  readonly total: number;
  readonly size: number;
}
export interface ListPaginationInterface<Entity> {
  pagination: PaginationInterface;
  content: Entity[];
}

export interface ResponseSuccessSingleInterface extends ResponseInterface {
  readonly response_output: {
    detail: any;
  };
}

export interface ResponseSuccessPaginationInterface extends ResponseInterface {
  readonly response_output: {
    list: ListPaginationInterface<any>;
  };
}

export interface ResponseSuccessCollectionInterface extends ResponseInterface {
  readonly response_output: {
    list: {
      pagination: null;
      content: any[];
    };
  };
}

export interface ResponseErrorInterface extends ResponseInterface {
  readonly response_output: {
    errors: ErrorMessageInterface[];
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type IApplyDecorator = <TFunction extends Function, Y>(
  target: Record<string, any> | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void;
