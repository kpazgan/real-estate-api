import { OnQueueFailed } from '@nestjs/bull';
import { LoggerService } from '../logger/logger.service';
import { Job } from 'bull';

export abstract class BaseConsumer {
  constructor(protected readonly logger: LoggerService) {}

  @OnQueueFailed()
  async onError(job: Job<string>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
      `Queue`,
      job.data,
    );
  }
}
