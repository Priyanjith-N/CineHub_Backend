import express, { Express, Router } from 'express';

import AdminRepository from '../../adapters/repositories/admin.repository';
import AdminUseCase from '../../usecase/admin.usecase';
import AdminController from '../../adapters/controllers/admin.controller';

// import utils
import JWTService from '../utils/jwtService.utils';
import EmailService from '../utils/emailService.utils';
import CloudinaryService from '../utils/cloudinaryService.utils';

import AuthMiddleware from '../middleware/auth.middleware';

// interfaces
import { IAdminRepository } from '../../interface/repositories/admin.repository.interface';
import { IAdminUseCase } from '../../interface/usecase/admin.usecase.interface';
import { IAdminController } from '../../interface/controllers/admin.controller.interface';
import ICloudinaryService from '../../interface/utils/ICloudinaryService';
import IJWTService from '../../interface/utils/IJWTService';
import IEmailService from '../../interface/utils/IEmailService';
import IAuthMiddleware from '../../interface/middlewares/authMiddleware.interface';

const router: Router = express.Router();

// services
const jwtService: IJWTService = new JWTService();
const emailService: IEmailService = new EmailService();
const cloudinaryService: ICloudinaryService = new CloudinaryService();

// middlewares
const authMiddleware: IAuthMiddleware = new AuthMiddleware("Admin", jwtService);

const adminRepository: IAdminRepository = new AdminRepository();
const adminUseCase: IAdminUseCase = new AdminUseCase(adminRepository, emailService, cloudinaryService);
const adminController: IAdminController = new AdminController(adminUseCase);

// router middleware
router.use(authMiddleware.isAuthenticate.bind(authMiddleware));

// return all users data as response
router.get('/users', adminController.getAllUsers.bind(adminController));

router.patch('/users/:id', adminController.blockOrUnblockUser.bind(adminController));

// return all theater owners data as response
router.get('/theaterOwners', adminController.getAllTheaterOwners.bind(adminController));

router.get('/theaterOwner/:id', adminController.getTheaterOwnerData.bind(adminController));

router.patch('/theaterOwners/:id', adminController.blockOrUnblockTheaterOwner.bind(adminController));

router.patch('/theaterOwnerVerifyDocument/:id', adminController.changeDocumentVerificationStatusTheaterOwner.bind(adminController));

// return all distributer data as response
router.get('/distributers', adminController.getAllDistributers.bind(adminController));

router.get('/distributers/:id', adminController.getDistributerData.bind(adminController));

router.patch('/distributers/:id', adminController.blockOrUnblockDistributer.bind(adminController));

router.patch('/distributersVerifyDocument/:id', adminController.changeDocumentVerificationStatusDistributer.bind(adminController));

// geting all data of new accounts register by theater owners and distributers for document verification
router.get('/getAllDoumentVerificationRequests', adminController.getAllDocumentVerificationRequest.bind(adminController));

// movie management api's
router.get('/movie', adminController.getAllMovies.bind(adminController));

router.get('/movie/:movieId', adminController.getMovie.bind(adminController));

router.patch('/listorunlist/:id', adminController.listOrUnlistMovies.bind(adminController));

router.post('/addmovie', adminController.addMovieRequest.bind(adminController));

router.patch('/editmovie/:movieId', adminController.updateMovie.bind(adminController));

router.get('/getdashboarddata', adminController.getDashboardData.bind(adminController));

export default router;