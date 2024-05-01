import { Injectable } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { DatabaseService } from '../../database/database.service';
import { ListingProducer } from './queue/listing.producer';
import { FileService } from '../../utilities/file/file.service';
import { UploadListingImageDto } from './dto/upload-listing-image.dto';
import { ConfigService } from '@nestjs/config';
import { GoogleCloudService } from '../../services/google-cloud/google-cloud.service';

@Injectable()
export class ListingService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly listingQueue: ListingProducer,
    private readonly fileService: FileService,
    private readonly confgService: ConfigService,
    private readonly googleCloudService: GoogleCloudService,
  ) {}

  async create({
    data,
    images,
  }: {
    data: CreateListingDto;
    images: Express.Multer.File[];
  }) {
    const listing = await this.databaseService.listing.create({
      data: data,
    });
    for (const image of images) {
      // send image to queue
      await this.listingQueue.uploadListingImage({
        base64File: this.fileService.bufferToBase64(image.buffer),
        mimeType: image.mimetype,
        listingId: listing.id,
      });
    }
    return listing;
  }

  async createListingImage(data: UploadListingImageDto) {
    const mimeType = data.mimeType;
    const buffer = this.fileService.base64ToBuffer(data.base64File);
    const bucketName = this.confgService.getOrThrow(
      `gcp.buckets.listingImages`,
    );
    const publicUrl = await this.googleCloudService.uploadFile(
      bucketName,
      buffer,
      mimeType,
    );
    return await this.databaseService.listingImage.create({
      data: {
        listingId: data.listingId,
        url: publicUrl,
      },
    });
  }
}
