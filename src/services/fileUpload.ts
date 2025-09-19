import multer, { StorageEngine } from "multer";
import { Request } from "express";

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
}

export default FileUpload;