import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { UidService } from '../../utilities/uid/uid.service';

@Injectable()
export class GoogleCloudService {
  private storage: Storage;

  constructor(
    private readonly configService: ConfigService,
    private readonly uidService: UidService,
  ) {
    this.storage = new Storage({
      projectId: this.configService.get(`gcp.projectId`),
      credentials: {
        client_email: this.configService.get(`gcp.clientEmail`),
        private_key: this.configService.get(`gcp.privateKey`),
      },
    });
  }

  async uploadFile(
    bucketName: string,
    fileBuffer: Buffer,
    fileMimeType: string,
  ) {
    const bucket = this.storage.bucket(bucketName);
    const fileName = this.uidService.generate(); // TODO: Generate a random file name
    const file = bucket.file(fileName);
    await file.save(fileBuffer, {
      metadata: {
        contentType: fileMimeType,
      },
      gzip: true,
    });

    await file.makePublic();
    return file.publicUrl();
  }
}
