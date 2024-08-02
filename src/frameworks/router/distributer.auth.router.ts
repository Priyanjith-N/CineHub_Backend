import express, { Router } from "express";

import DistributerAuthenticationController from "../../adapters/controllers/distributer.auth.controller";
import DistributerAuthUseCase from "../../usecase/distributer.auth.usecase";
import DistributerAuthRepository from "../../adapters/repositories/distributer.auth.repository";
import OTPRepository from "../../adapters/repositories/OTP.repository";

// import utils
import HashingService from "../utils/hashingService.utils";
import OTPService from "../utils/otpService.utils";
import EmailService from "../utils/emailService.utils";
import JWTService from "../utils/jwtService.utils";
import CloudinaryService from "../utils/cloudinaryService.utils";
import { GoogleAuthService } from "../utils/googleAuthService.utils";

// interfaces
import { IDistributerAuthenticationController } from "../../interface/controllers/distributer.IAuth.controller";
import IDistributerAuthUseCase from "../../interface/usecase/distributer.IAuth.usecase";
import IDistributerAuthRepository from "../../interface/repositories/distributer.IAuth.repository";
import IHashingService from "../../interface/utils/IHashingService";
import IOTPService from "../../interface/utils/IOTPService";
import IEmailService from "../../interface/utils/IEmailService";
import IJWTService from "../../interface/utils/IJWTService";
import ICloudinaryService from "../../interface/utils/ICloudinaryService";
import IOTPRepository from "../../interface/repositories/OTP.IOTPRepository.interface";
import { IGoogleAuthService } from "../../interface/utils/IGoogleAuthService";

const router: Router = express.Router();

// services
const hashingService: IHashingService = new HashingService();
const otpService: IOTPService = new OTPService();
const emailService: IEmailService = new EmailService();
const jwtService: IJWTService = new JWTService();
const cloudinaryService: ICloudinaryService = new CloudinaryService();
const googleAuthService: IGoogleAuthService = new GoogleAuthService();

const distributerAuthRepository: IDistributerAuthRepository = new DistributerAuthRepository();
const otpRepository: IOTPRepository = new OTPRepository();
const distributerAuthUseCase: IDistributerAuthUseCase = new DistributerAuthUseCase(distributerAuthRepository, otpRepository, hashingService, otpService, emailService, jwtService, cloudinaryService, googleAuthService);
const distributerAuthController: IDistributerAuthenticationController = new DistributerAuthenticationController(distributerAuthUseCase);

router.post('/googleauthlogin', distributerAuthController.googleAuthLogin.bind(distributerAuthController));

router.get('/verifyToken', distributerAuthController.verifyTokenRequest.bind(distributerAuthController));

router.post('/login', distributerAuthController.handleLoginRequest.bind(distributerAuthController));

router.post('/logout', distributerAuthController.handleLogoutRequest.bind(distributerAuthController));

router.post('/register', distributerAuthController.handleRegisterRequest.bind(distributerAuthController));

router.post('/otpVerify', distributerAuthController.handleOTPVerificationRequest.bind(distributerAuthController));

router.post('/otpResend', distributerAuthController.handleOTPResendRequest.bind(distributerAuthController));

export default router;