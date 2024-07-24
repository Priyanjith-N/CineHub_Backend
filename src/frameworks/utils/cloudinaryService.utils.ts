import * as cloudinary from 'cloudinary';

// interfaces
import ICloudinaryService from '../../interface/utils/ICloudinaryService';

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};


// configure cloudinary
cloudinary.v2.config(cloudinaryConfig);

export default class CloudinaryService implements ICloudinaryService {
    async uploadImage(imageDataBase64: string): Promise<string | never> {
        try {
            const uploadApiResponse: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(imageDataBase64, { folder: 'CineHub' });

            return uploadApiResponse.secure_url;
        } catch (err: any) {
            throw err;
        }
    }
}