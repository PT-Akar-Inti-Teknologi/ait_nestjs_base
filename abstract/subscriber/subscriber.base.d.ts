import { DataSource, EntitySubscriberInterface, EntityTarget, ObjectLiteral } from 'typeorm';
import { ResponseSuccessSingleDTO } from '../../response/dto/response/response-success-single.dto';
import { ResponseService } from '../../response/service/response.service';
import { MessageService } from '../../response/service/message.service';
export declare enum EventType {
    INSERT = "beforeInsert",
    UPDATE = "beforeUpdate",
    DELETE = "beforeRemove"
}
export interface Event<E> {
    type: EventType;
    before: E;
    after: E;
}
export declare abstract class BaseSubscriber<E extends ObjectLiteral> implements EntitySubscriberInterface<E> {
    protected readonly dataSource: DataSource;
    protected readonly responseService: ResponseService;
    protected readonly messageService: MessageService;
    protected constructor(dataSource: DataSource, responseService: ResponseService, messageService: MessageService);
    /**
     * Dynamic proxy build event from typeorm to internal event
     *
     * @param publisher {string}
     * @param subscriber {string}
     * @private {void}
     */
    private proxy;
    abstract listenTo(): any;
    protected abstract onCommit(event: Event<E>): Promise<any>;
    /**
     * Function to find detail by id and load all relations
     *
     * @param target {Object | Function} of {E}
     * @param id {string}
     * @protected
     */
    protected findDetail<D>(target: EntityTarget<D>, id: string): Promise<D>;
    /**
     * Function to disable end point of CRUD
     *
     * @private
     */
    protected notImplemented(): Promise<ResponseSuccessSingleDTO>;
}
