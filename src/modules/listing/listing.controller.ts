import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MaxFilesCountValidationPipe } from '../../common/pipes/max-files-count-validation/max-files-count-validation.pipe';

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  @UseInterceptors(FilesInterceptor(`images`))
  create(
    @Body() createListingDto: CreateListingDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: `.(png|jpeg|jpg)` }),
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
        ],
      }),
      new MaxFilesCountValidationPipe(10),
    )
    files: Express.Multer.File[],
  ) {
    console.log(`files:`, files);
    return this.listingService.create({
      data: createListingDto,
      images: files,
    });
  }
}
