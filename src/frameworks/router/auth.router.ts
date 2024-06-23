import express, { NextFunction, Request, Response, Router } from 'express';
import AuthController from '../../adapters/controllers/auth.controller';
import AuthUseCase from '../../usecase/auth.usecase';
import AuthRepository from '../../adapters/repositories/auth.repositories';

// import utils
import HashingService from '../utils/hashingService.utils';
import JWTService from '../utils/jwtService.utils';
import EmailService from '../utils/emailService.utils';
import OTPService from '../utils/otpService.utils';

// importing collections
import Users from '../models/user.model';
import OTPs from '../models/otp.model';

// interfaces
import { IAuthController } from '../../interface/controllers/IAuth.controller';
import IAuthUseCase from '../../interface/usecase/IAuth.usecase';
import IAuthRepository from '../../interface/repositories/IAuth.repositories';
import IHashingService from '../../interface/utils/IHashingService';
import IJWTService from '../../interface/utils/IJWTService';
import IEmailService from '../../interface/utils/IEmailService';
import IOTPService from '../../interface/utils/IOTPService';

const router: Router = express.Router();

const authRepository: IAuthRepository = new AuthRepository(Users, OTPs);
const hashingService: IHashingService = new HashingService();
const jwtService: IJWTService = new JWTService();
const emailService: IEmailService = new EmailService();
const otpService: IOTPService = new OTPService();
const authUseCase: IAuthUseCase = new AuthUseCase(authRepository, hashingService, jwtService, emailService, otpService);
const authController: IAuthController = new AuthController(authUseCase);

router.get('/verifyToken', authController.verifyTokenRequest.bind(authController));

router.post('/login', authController.handleLoginRequest.bind(authController));

router.post('/logout', authController.handleLogoutRequest.bind(authController));

router.post('/register', authController.handleRegisterRequest.bind(authController));

router.post('/otpVerify', authController.handleOTPVerificationRequest.bind(authController));

router.post('/otpResend', authController.handleOTPResendRequest.bind(authController));

export default router;