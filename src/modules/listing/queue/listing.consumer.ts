import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { LISTING_QUEUE } from '../../../core/queue/queue.constants';
import { LoggerService } from '../../../core/logger/logger.service';
import { BaseConsumer } from '../../../core/queue/base.consumer';
import { UploadListingImageDto } from '../dto/upload-listing-image.dto';
import { ListingService } from '../listing.service';

@Processor(LISTING_QUEUE)
export class ListingConsumer extends BaseConsumer {
  constructor(
    logger: LoggerService,
    private readonly listingSerivce: ListingService,
  ) {
    super(logger);
  }

  @Process(`createListingImage`)
  async createListingImage(job: Job<UploadListingImageDto>) {
    return await this.listingSerivce.createListingImage(job.data);
  }

  @OnQueueFailed()
  async onError(job: Job<string>, error: any) {
    super.onError(job, error);
  }
}
