import express, { Express, Router } from 'express';

import AdminRepository from '../../adapters/repositories/admin.repository';
import AdminUseCase from '../../usecase/admin.usecase';
import AdminController from '../../adapters/controllers/admin.controller';


//import collections
import Users from '../models/user.model';
import TheaterOwners from '../models/theaterOwner.model';
import Distributers from '../models/distributer.model';

// import utils
import JWTService from '../utils/jwtService.utils';
import EmailService from '../utils/emailService.utils';
import IJWTService from '../../interface/utils/IJWTService';
import IEmailService from '../../interface/utils/IEmailService';
import { IAdminRepository } from '../../interface/repositories/admin.repository.interface';
import { IAdminUseCase } from '../../interface/usecase/admin.usecase.interface';
import { IAdminController } from '../../interface/controllers/admin.controller.interface';

// interfaces

const router: Router = express.Router();

// services
const jwtService: IJWTService = new JWTService();
const emailService: IEmailService = new EmailService();

const adminRepository: IAdminRepository = new AdminRepository(Users, TheaterOwners, Distributers);
const adminUseCase: IAdminUseCase = new AdminUseCase(adminRepository, emailService);
const adminController: IAdminController = new AdminController(adminUseCase);

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

export default router;