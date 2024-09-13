import express, { Express, Router } from 'express';

import RefreshTokenAuthController from '../../adapters/controllers/refreshToken.auth.controller';
import RefreshTokenAuthUseCase from '../../usecase/refreshToken.auth.usecase';

// import utils
import JWTService from '../utils/jwtService.utils';

// interfaces
import IJWTService from '../../interface/utils/IJWTService';
import IRefreshTokenAuthUseCase from '../../interface/usecase/IRefreshToken.IAuth.usecase';
import IRefreshTokenAuthController from '../../interface/controllers/refreshToken.IAuth.controller';

const router: Router = express.Router();

// services
const jwtService: IJWTService = new JWTService();

const refreshTokenAuthUseCase: IRefreshTokenAuthUseCase = new RefreshTokenAuthUseCase(jwtService);
const refreshTokenAuthController: IRefreshTokenAuthController = new RefreshTokenAuthController(refreshTokenAuthUseCase);

router.post('/', refreshTokenAuthController.getNewAccessTokenWithRefreshToken.bind(refreshTokenAuthController))

export default router;