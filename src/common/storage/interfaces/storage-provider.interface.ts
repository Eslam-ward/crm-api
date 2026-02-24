export interface IStorageProvider {
  upload(
    file: Buffer,
    mimetype: string,
    folder: string,
    options?: {
      isPrivate?: boolean;
    },
  ): Promise<string>;

  delete?(publicId: string): Promise<void>;

  getSignedUrl?(publicId: string): Promise<string>;
}