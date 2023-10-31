"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseQueue = void 0;
const common_1 = require("@nestjs/common");
class BaseQueue {
    /**
     * Inject Bull Queue and listen when redis connect disconnect
     * to trigger createJob
     * @param queue {Queue}
     */
    constructor(queue) {
        this.queue = queue;
        this.isBeingCreate = false;
        this.logger = new common_1.Logger(this.constructor.name);
        this.queue.isReady().then(async () => {
            await this.initJob();
            this.queue.client.on('ready', this.initJob.bind(this));
        });
    }
    /**
     * Call when queue redis connected or can call from other service,
     * isBeingCreate is helper to ensure only once execute per event.
     */
    async initJob() {
        if (!this.isBeingCreate) {
            this.isBeingCreate = true;
            try {
                await this.queue.empty();
                const job = await this.createJob();
                if (job) {
                    this.logger.debug('Create/Renew scheduler', JSON.stringify(job.data), JSON.stringify(job.opts));
                }
            }
            catch (e) {
                this.logger.error('Failed Create/Renew scheduler', e);
            }
            this.isBeingCreate = false;
        }
    }
    /**
     * Call from child to recreate job after previous process done
     *
     * @param job
     * @protected
     */
    async onJob(job) {
        if (job) {
            this.logger.debug(`${job.name} Job completed`, JSON.stringify(job.data));
        }
        await this.initJob();
    }
}
exports.BaseQueue = BaseQueue;
//# sourceMappingURL=queue.base.js.map