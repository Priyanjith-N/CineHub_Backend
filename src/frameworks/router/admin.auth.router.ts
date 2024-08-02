import express, { Express, Router } from 'express';

import AdminAuthenticationController from '../../adapters/controllers/admin.auth.controller';
import AdminAuthUseCase from '../../usecase/admin.auth.usecase';
import AdminAuthRepository from '../../adapters/repositories/admin.auth.repository';

// import utils
import HashingService from '../utils/hashingService.utils';
import JWTService from '../utils/jwtService.utils';
import EmailService from '../utils/emailService.utils';

// interfaces
import { IAdminAuthenticationController } from '../../interface/controllers/admin.IAuth.controller';
import IHashingService from '../../interface/utils/IHashingService';
import IJWTService from '../../interface/utils/IJWTService';
import IEmailService from '../../interface/utils/IEmailService';
import IAdminAuthRepository from '../../interface/repositories/admin.IAuth.repository';
import IAdminAuthUseCase from '../../interface/usecase/admin.IAuth.usecase';

const router: Router = express.Router();

// services
const hashingService: IHashingService = new HashingService();
const jwtService: IJWTService = new JWTService();
const emailService: IEmailService = new EmailService();

const adminAuthRepository: IAdminAuthRepository = new AdminAuthRepository();
const adminAuthUseCase: IAdminAuthUseCase = new AdminAuthUseCase(adminAuthRepository, hashingService, emailService, jwtService);
const adminAuthenticationController:IAdminAuthenticationController = new AdminAuthenticationController(adminAuthUseCase);

router.get('/verifyToken', adminAuthenticationController.verifyTokenRequest.bind(adminAuthenticationController));

router.post('/login', adminAuthenticationController.handleLoginRequest.bind(adminAuthenticationController));

router.post('/logout', adminAuthenticationController.handleLogoutRequest.bind(adminAuthenticationController));

export default router;