export default interface IRefreshTokenAuthUseCase {
    getNewAccessTokenWithRefreshToken(refreshToken: string | undefined): Promise<string | never>;
}