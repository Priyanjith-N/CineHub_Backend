import express, { NextFunction, Request, Response, Router } from 'express';

import UserAuthenticationController from '../../adapters/controllers/user.auth.controller';
import UserAuthUseCase from '../../usecase/user.auth.usecase';
import UserAuthRepository from '../../adapters/repositories/user.auth.repositories';

// import utils
import HashingService from '../utils/hashingService.utils';
import JWTService from '../utils/jwtService.utils';
import EmailService from '../utils/emailService.utils';
import OTPService from '../utils/otpService.utils';

// importing collections
import Users from '../models/user.model';
import OTPs from '../models/otp.model';

// interfaces
import { IUserAuthenticationController } from '../../interface/controllers/user.IAuth.controller';
import IHashingService from '../../interface/utils/IHashingService';
import IJWTService from '../../interface/utils/IJWTService';
import IEmailService from '../../interface/utils/IEmailService';
import IOTPService from '../../interface/utils/IOTPService';
import IUserAuthRepository from '../../interface/repositories/user.IAuth.repositories';
import IUserAuthUseCase from '../../interface/usecase/user.IAuth.usecase';
import IOTPRepository from '../../interface/repositories/OTP.IOTPRepository.interface';
import OTPRepository from '../../adapters/repositories/OTP.repository';

const router: Router = express.Router();

// services
const hashingService: IHashingService = new HashingService();
const jwtService: IJWTService = new JWTService();
const emailService: IEmailService = new EmailService();
const otpService: IOTPService = new OTPService();

const userAuthRepository: IUserAuthRepository = new UserAuthRepository(Users);
const otpRepository: IOTPRepository = new OTPRepository(OTPs);
const userAuthUseCase: IUserAuthUseCase = new UserAuthUseCase(userAuthRepository, otpRepository, hashingService, jwtService, emailService, otpService);
const userAuthController: IUserAuthenticationController = new UserAuthenticationController(userAuthUseCase);

router.get('/verifyToken', userAuthController.verifyTokenRequest.bind(userAuthController));

router.post('/login', userAuthController.handleLoginRequest.bind(userAuthController));

router.post('/logout', userAuthController.handleLogoutRequest.bind(userAuthController));

router.post('/register', userAuthController.handleRegisterRequest.bind(userAuthController));

router.post('/otpVerify', userAuthController.handleOTPVerificationRequest.bind(userAuthController));

router.post('/otpResend', userAuthController.handleOTPResendRequest.bind(userAuthController));

export default router;