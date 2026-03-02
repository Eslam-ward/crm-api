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
// The IStorageProvider interface defines the contract for any storage provider implementation. It includes methods for uploading files, deleting files, and generating signed URLs. By adhering to this interface,
//  different storage providers can be integrated into the application without requiring changes to the core logic of the application.