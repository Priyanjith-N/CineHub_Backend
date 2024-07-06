import express, { Express, Router } from 'express';
import AuthRepository from '../../../adapters/repositories/admin/auth.repository';
import AuthController from '../../../adapters/controllers/admin/auth.controller';
import AuthUseCase from '../../../usecase/admin/auth.usecase';

// import utils
import HashingService from '../../utils/hashingService.utils';
import JWTService from '../../utils/jwtService.utils';
import EmailService from '../../utils/emailService.utils';

// interfaces
import { IAuthController } from '../../../interface/controllers/admin/IAuth.controller';
import IAuthUseCase from '../../../interface/usecase/admin/IAuth.usecase';
import IHashingService from '../../../interface/utils/IHashingService';
import IJWTService from '../../../interface/utils/IJWTService';
import IEmailService from '../../../interface/utils/IEmailService';
import IAuthRepository from '../../../interface/repositories/admin/IAuth.repository';
import Admins from '../../models/admin.model';

const router: Router = express.Router();

// services
const hashingService: IHashingService = new HashingService();
const jwtService: IJWTService = new JWTService();
const emailService: IEmailService = new EmailService();

const authRepository: IAuthRepository = new AuthRepository(Admins);
const authUseCase: IAuthUseCase = new AuthUseCase(authRepository, hashingService, emailService, jwtService);
const authController :IAuthController = new AuthController(authUseCase);

router.post('/login', authController.handleLoginRequest.bind(authController));

export default router;