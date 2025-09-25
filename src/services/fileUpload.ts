import { Request } from "express";
import multer, { StorageEngine } from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

// AWS S3 Bucket config
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

class FileUpload {
  public localStorage(): multer.Multer {
    const storage: StorageEngine = multer.diskStorage({
      destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
      ) => {
        cb(null, "public/");
      },
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
      ) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      },
    });

    const upload = multer({ storage });
    return upload;
  }

  // S3 file upload: multiple images
  public s3Storage(): multer.Multer {
    const s3Storage = multerS3({
      s3,
      bucket: process.env.AWS_S3_BUCKET_NAME as string,
      key: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, key?: string) => void
      ) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        // Key under "digital-gold-app/kyc/"
        const s3Key = `digital-gold-app/kyc/${uniqueSuffix}-${file.originalname}`;
        cb(null, s3Key);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
    });

    const upload = multer({ storage: s3Storage });
    return upload;
  }
}

export default FileUpload;
