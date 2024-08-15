import IImage from "../common/IImage.interface";

export default interface ICloudinaryService {
    uploadImage(imageDataBase64: string): Promise<IImage | never>;
}