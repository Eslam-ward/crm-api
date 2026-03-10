import { Injectable, BadRequestException } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ALLOWED_IMAGE_TYPES } from './constants/allowed-file-types.constant';

@Injectable()
export class UploadService {
  constructor(private readonly storageService: StorageService) {}

  async upload(files: Express.Multer.File[]): Promise<string[]> {

    if (!files?.length) {
      throw new BadRequestException('At least one image is required');
    }

    return this.storageService.uploadMultiple(
      files,
      'locations',
      { allowedTypes: ALLOWED_IMAGE_TYPES },
    );
  }

  async replace(
    oldImages: string[],
    newFiles?: Express.Multer.File[],
  ): Promise<string[]> {

    if (!newFiles?.length) return oldImages;

    await this.deleteImages(oldImages);

    return this.upload(newFiles);
  }

  async deleteImages(imageUrls: string[]) {
    if (!imageUrls?.length) return;

    await Promise.all(
      imageUrls.map((url) =>
        this.storageService.delete(this.extractPublicId(url)),
      ),
    );
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    const relevantParts = parts.slice(uploadIndex + 2);
    return relevantParts.join('/').replace(/\.[^/.]+$/, '');
  }
}