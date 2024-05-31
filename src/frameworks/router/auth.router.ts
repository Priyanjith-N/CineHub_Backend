import express, { NextFunction, Request, Response, Router } from 'express';
import AuthController from '../../adapters/controllers/auth.controller';
import AuthUseCase from '../../usecase/auth.usecase';

// interfaces
import { IAuthController } from '../../interface/controllers/IAuth.controller';
import IAuthUseCase from '../../interface/usecase/IAuth.usecase';

const router: Router = express.Router();

const authUseCase: IAuthUseCase = new AuthUseCase();
const authController: IAuthController = new AuthController(authUseCase);



router.post('/login', authController.handleLoginRequest.bind(authController));

export default router;