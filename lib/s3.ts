import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

class S3Handler {
  #client: S3Client | null = null;
  #bucket: string = process.env.BUCKET_NAME!;

  #getClient(): S3Client {
    if (this.#client) return this.#client;

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION;
    const endpoint = process.env.AWS_ENDPOINT_URL_S3;

    if (!accessKeyId || !secretAccessKey || !region || !endpoint) {
      throw new Error("AWS credentials are not set");
    }

    this.#client = new S3Client({
      credentials: { accessKeyId, secretAccessKey },
      region,
      endpoint,
      forcePathStyle: true,
    });

    return this.#client;
  }

  /**
   * Upload an image to S3
   * @param slug - Series slug used for filename
   * @param type - 'thumbnail' or 'background'
   * @param file - The image file buffer
   * @param contentType - MIME type of the image
   * @returns The public URL of the uploaded image
   */
  async uploadImage(
    slug: string,
    type: "thumbnail" | "background",
    file: Buffer,
    contentType: string
  ): Promise<string> {
    const extension = this.#getExtension(contentType);
    const filename = `${slug}-${type}.${extension}`;
    const key = `thumbnails/${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.#bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this.#getClient().send(command);

    // Use S3_PUBLIC_URL for the public-facing URL
    const publicUrl = process.env.S3_PUBLIC_URL;
    if (!publicUrl) {
      throw new Error("S3_PUBLIC_URL environment variable is not set");
    }

    return `${publicUrl}/${key}`;
  }

  #getExtension(contentType: string): string {
    const map: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };
    return map[contentType] || "jpg";
  }
}

export const S3 = new S3Handler();
