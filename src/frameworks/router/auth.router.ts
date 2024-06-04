import express, { NextFunction, Request, Response, Router } from 'express';
import AuthController from '../../adapters/controllers/auth.controller';
import AuthUseCase from '../../usecase/auth.usecase';
import AuthRepository from '../../adapters/repositories/auth.repositories';

// import utils
import HashingService from '../utils/hashingService.utils';
import JWTService from '../utils/jwtService.utils';

// importing collections
import Users from '../models/user.model';

// interfaces
import { IAuthController } from '../../interface/controllers/IAuth.controller';
import IAuthUseCase from '../../interface/usecase/IAuth.usecase';
import IAuthRepository from '../../interface/repositories/IAuth.repositories';
import IHashingService from '../../interface/utils/IHashingService';
import IJWTService from '../../interface/utils/IJWTService';

const router: Router = express.Router();

const authRepository: IAuthRepository = new AuthRepository(Users);
const hashingService: IHashingService = new HashingService();
const jwtService: IJWTService = new JWTService();
const authUseCase: IAuthUseCase = new AuthUseCase(authRepository, hashingService, jwtService);
const authController: IAuthController = new AuthController(authUseCase);

router.post('/login', authController.handleLoginRequest.bind(authController));

router.post('/register', authController.handleRegisterRequest.bind(authController));

export default router;