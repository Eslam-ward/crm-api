import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { IStorageProvider } from '../interfaces/storage-provider.interface';

@Injectable()
export class CloudinaryProvider implements IStorageProvider {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(
    file: Buffer,
    mimetype: string,
    folder: string,
    options?: { isPrivate?: boolean },
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: mimetype.startsWith('image/') ? 'image' : 'raw',
          type: options?.isPrivate ? 'private' : 'upload',
          transformation: mimetype.startsWith('image/')
            ? [
                { width: 1000, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
              ]
            : undefined,
        },
        (error, result) => {
          if (error) return reject(error);

          if (!result?.secure_url) {
            return reject(
              new Error('Cloudinary upload failed: No secure URL'),
            );
          }

          resolve(result.secure_url);
        },
      );

      uploadStream.end(file);
    });
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  async getSignedUrl(publicId: string): Promise<string> {
    return cloudinary.url(publicId, {
      sign_url: true,
      secure: true,
      type: 'private',
    });
  }
}