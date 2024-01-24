import { Job, Queue } from 'bull';
import { Logger } from '@nestjs/common';

export abstract class BaseQueue {
  protected readonly logger;
  private isBeingCreate = false;

  /**
   * Inject Bull Queue and listen when redis connect disconnect
   * to trigger createJob
   * @param queue {Queue}
   */
  protected constructor(protected readonly queue: Queue) {
    this.logger = new Logger(this.constructor.name);

    this.queue.isReady().then(async () => {
      await this.initJob();

      this.queue.client.on('ready', this.initJob.bind(this));
    });
  }

  /**
   * Call when queue redis connected or can call from other service,
   * isBeingCreate is helper to ensure only once execute per event.
   */
  private async initJob() {
    if (!this.isBeingCreate) {
      this.isBeingCreate = true;

      try {
        await this.queue.empty();

        const job: Job = await this.createJob();

        if (job) {
          this.logger.debug(
            'Create/Renew scheduler',
            JSON.stringify(job.data),
            JSON.stringify(job.opts),
          );
        }
      } catch (e) {
        this.logger.error('Failed Create/Renew scheduler', e);
      }

      this.isBeingCreate = false;
    }
  }

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
  protected async onJob(job: Job): Promise<void> {
    if (job) {
      this.logger.debug(`${job.name} Job completed`, JSON.stringify(job.data));
    }

    await this.initJob();
  }
}
