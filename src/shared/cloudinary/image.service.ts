import streamifier from 'streamifier'
import { UploadedImage } from './images.types';
import cloudinary from './cloudinary';
class ImageService {
    uploadSingle(file: Express.Multer.File, folder: string): Promise<UploadedImage> {
        return new Promise((res, rej) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "image"
                },
                (error, result) => {
                    if(error || !result) {
                        return rej(error)
                    }
                    res({
                        url: result.secure_url,
                        publicId: result.public_id
                    })
                }
            )
            streamifier.createReadStream(file.buffer).pipe(stream);
        })
    }
    async uploadMultiple(
        files: Express.Multer.File[],
        folder: string
    ): Promise<UploadedImage[]> {
        return Promise.all(
            files.map((file) => this.uploadSingle(file, folder))
        )
    }
    async delete(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId)
    }
    async replace(
        oldPublicId: string,
        file: Express.Multer.File,
        folder: string
    ): Promise<UploadedImage>{
        await this.delete(oldPublicId);
        return this.uploadSingle(file, folder)
    }
}

export const imageService = new ImageService();