"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSubscriber = exports.EventType = void 0;
const common_1 = require("@nestjs/common");
var EventType;
(function (EventType) {
    EventType["INSERT"] = "beforeInsert";
    EventType["UPDATE"] = "beforeUpdate";
    EventType["DELETE"] = "beforeRemove";
})(EventType = exports.EventType || (exports.EventType = {}));
class BaseSubscriber {
    constructor(dataSource, responseService, messageService) {
        this.dataSource = dataSource;
        this.responseService = responseService;
        this.messageService = messageService;
        dataSource.subscribers.push(this);
        this.proxy('afterTransactionCommit', 'onCommit');
    }
    /**
     * Dynamic proxy build event from typeorm to internal event
     *
     * @param publisher {string}
     * @param subscriber {string}
     * @private {void}
     */
    proxy(publisher, subscriber) {
        this[publisher] = async (e) => {
            if (typeof e.queryRunner[subscriber] === 'object' &&
                e.queryRunner[subscriber].target == this.listenTo() &&
                typeof e.queryRunner[subscriber][subscriber] === 'function' &&
                typeof this[subscriber] === 'function') {
                await this[subscriber](await e.queryRunner[subscriber][subscriber]());
            }
        };
        Object.keys(EventType).forEach((type) => {
            this[EventType[type]] = async (e) => {
                const event = { type: EventType[type], before: null, after: null };
                if (e.databaseEntity) {
                    event.before = await this.findDetail(this.listenTo(), e.databaseEntity.id);
                }
                e.queryRunner[subscriber] = {
                    target: this.listenTo(),
                    [subscriber]: async () => {
                        event.after = await this.findDetail(this.listenTo(), e.entity.id);
                        return event;
                    },
                };
            };
        });
    }
    /**
     * Function to find detail by id and load all relations
     *
     * @param target {Object | Function} of {E}
     * @param id {string}
     * @protected
     */
    findDetail(target, id) {
        return this.dataSource.createEntityManager().findOne(target, {
            where: { id },
            relations: this.dataSource
                .getMetadata(target)
                .ownRelations.slice(0)
                .map((r) => r.propertyName),
        });
    }
    /**
     * Function to disable end point of CRUD
     *
     * @private
     */
    notImplemented() {
        throw new common_1.BadRequestException(this.responseService.error(common_1.HttpStatus.BAD_REQUEST, [
            this.messageService.getErrorMessage('date', 'general.general.data_not_allowed'),
        ], 'Bad Request'));
    }
}
exports.BaseSubscriber = BaseSubscriber;
//# sourceMappingURL=subscriber.base.js.map