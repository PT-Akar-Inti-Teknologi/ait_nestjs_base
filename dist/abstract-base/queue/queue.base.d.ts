import { Job, Queue } from 'bull';
export declare abstract class BaseQueue {
    protected readonly queue: Queue;
    protected readonly logger: any;
    private isBeingCreate;
    /**
     * Inject Bull Queue and listen when redis connect disconnect
     * to trigger createJob
     * @param queue {Queue}
     */
    protected constructor(queue: Queue);
    /**
     * Call when queue redis connected or can call from other service,
     * isBeingCreate is helper to ensure only once execute per event.
     */
    private initJob;
    /**
     * Abstraction to create job in child
     */
    abstract createJob(): Promise<Job>;
    /**
     * Call from child to recreate job after previous process done
     *
     * @param job
     * @protected
     */
    protected onJob(job: Job): Promise<void>;
}
//# sourceMappingURL=queue.base.d.ts.map