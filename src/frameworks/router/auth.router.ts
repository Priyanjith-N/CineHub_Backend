import express, { NextFunction, Request, Response, Router } from 'express';
import AuthController from '../../adapters/controllers/auth.controller';
import AuthUseCase from '../../usecase/auth.usecase';
import AuthRepository from '../../adapters/repositories/auth.repositories';

// importing collections
import Users from '../models/user.model';

// interfaces
import { IAuthController } from '../../interface/controllers/IAuth.controller';
import IAuthUseCase from '../../interface/usecase/IAuth.usecase';
import IAuthRepository from '../../interface/repositories/IAuth.repositories';

const router: Router = express.Router();

const authRepository: IAuthRepository = new AuthRepository(Users);
const authUseCase: IAuthUseCase = new AuthUseCase(authRepository);
const authController: IAuthController = new AuthController(authUseCase);



router.post('/login', authController.handleLoginRequest.bind(authController));

export default router;