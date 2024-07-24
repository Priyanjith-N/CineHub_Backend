export default interface ICloudinaryService {
    uploadImage(imageDataBase64: string): Promise<string | never>;
}