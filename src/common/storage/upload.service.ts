import { Injectable, BadRequestException } from '@nestjs/common';
import { StorageService } from './storage.service';


@Injectable()
export class UploadService {
  constructor(private readonly storageService: StorageService) {}

  async upload(
    files: Express.Multer.File[],
    allowedTypes: string[],
  ): Promise<string[]> {

    if (!files?.length) {
      throw new BadRequestException('At least one image is required');
    }

    return this.storageService.uploadMultiple(
      files,
      'locations',
      
      { allowedTypes },
    );
  }

  async replace(
    oldImages: string[],
    newFiles?: Express.Multer.File[],
    allowedTypes?: string[],
  ): Promise<string[]> {

    if (!newFiles?.length) return oldImages;

    await this.deleteImages(oldImages);

    return this.upload(newFiles, allowedTypes ?? []);
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