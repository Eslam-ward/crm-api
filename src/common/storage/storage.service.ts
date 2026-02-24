import {
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import * as storageProviderInterface from './interfaces/storage-provider.interface';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_PROVIDER')
    private readonly provider: storageProviderInterface.IStorageProvider,
  ) {}

  private validateFileType(
    mimetype: string,
    allowedTypes?: string[],
  ) {
    const defaultTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'audio/mpeg',
      'application/pdf',
    ];

    const allowed = allowedTypes ?? defaultTypes;

    if (!allowed.includes(mimetype)) {
      throw new BadRequestException(
        `Unsupported file type: ${mimetype}`,
      );
    }
  }

  async uploadSingle(
    file: Express.Multer.File,
    folder: string,
    options?: {
      isPrivate?: boolean;
      allowedTypes?: string[];
    },
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.validateFileType(file.mimetype, options?.allowedTypes);

    return this.provider.upload(
      file.buffer,
      file.mimetype,
      folder ,
      { isPrivate: options?.isPrivate },
    );
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder: string,
    options?: {
      isPrivate?: boolean;
      allowedTypes?: string[];
    },
  ): Promise<string[]> {
    if (!files?.length) {
      throw new BadRequestException('No files uploaded');
    }

    return Promise.all(
      files.map((file) => {
        this.validateFileType(file.mimetype, options?.allowedTypes);

        return this.provider.upload(
          file.buffer,
          file.mimetype,
          folder,
          { isPrivate: options?.isPrivate },
        );
      }),
    );
  }

  async delete(publicId: string) {
    if (!this.provider.delete) {
      throw new Error('Delete not supported');
    }
    return this.provider.delete(publicId);
  }

  async getSignedUrl(publicId: string) {
    if (!this.provider.getSignedUrl) {
      throw new Error('Signed URLs not supported');
    }
    return this.provider.getSignedUrl(publicId);
  }
}