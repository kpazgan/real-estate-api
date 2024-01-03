import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MaxFilesCountValidationPipe implements PipeTransform {
  constructor(private readonly maxFiles: number) {}
  transform(files: Express.Multer.File[]) {
    if (files.length > this.maxFiles) {
      throw new BadRequestException(
        `Maximum of ${this.maxFiles} file uploads allowed`,
      );
    }
    return files;
  }
}
