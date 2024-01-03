import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { LISTING_QUEUE } from '../../../core/queue/queue.constants';
import { LoggerService } from '../../../core/logger/logger.service';
import { BaseConsumer } from '../../../core/queue/base.consumer';

@Processor(LISTING_QUEUE)
export class ListingConsumer extends BaseConsumer {
  constructor(logger: LoggerService) {
    super(logger);
  }

  @Process(`createListingImage`)
  async createListingImage(job: Job<Express.Multer.File>) {
    console.log(`FILE PROCESSED IN QUEUE:`, job.data.originalname);
    return job.data;
  }

  @OnQueueFailed()
  async onError(job: Job<string>, error: any) {
    super.onError(job, error);
  }
}
