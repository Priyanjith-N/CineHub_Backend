import express, { Express, Router } from 'express';

import DistributerRepository from '../../adapters/repositories/distributer.repository';
import DistributerUseCase from '../../usecase/distributer.usecase';
import DistributerController from '../../adapters/controllers/distributer.controller';

// utils
import JWTService from '../utils/jwtService.utils';
import EmailService from '../utils/emailService.utils';

import AuthMiddleware from '../middleware/auth.middleware';

// interfaces
import IDistributerRepository from '../../interface/repositories/distributer.repository';
import IDistributerUseCase from '../../interface/usecase/distributer.usecase.interface';
import IDistributerController from '../../interface/controllers/distributer.controller.interface';
import IAuthMiddleware from '../../interface/middlewares/authMiddleware.interface';
import IJWTService from '../../interface/utils/IJWTService';
import IEmailService from '../../interface/utils/IEmailService';

const router: Router = express.Router();

// services
const jwtService: IJWTService = new JWTService();
const emailService: IEmailService = new EmailService();

// middlewares
const authMiddleware: IAuthMiddleware = new AuthMiddleware("Distributer", jwtService);

const distributerRepository: IDistributerRepository = new DistributerRepository();
const distributerUseCase: IDistributerUseCase = new DistributerUseCase(distributerRepository, emailService);
const distributerController: IDistributerController = new DistributerController(distributerUseCase);

router.get('/getallavailablemovies', distributerController.getAllAvailableMovies.bind(distributerController));

router.patch('/distributemovie/:id', authMiddleware.isAuthenticate.bind(authMiddleware), distributerController.distributeMovie.bind(distributerController));

router.get('/getmymovies', authMiddleware.isAuthenticate.bind(authMiddleware), distributerController.getMyMovies.bind(distributerController));

router.patch('/editprofitsharingofdistributedmovie/:id', authMiddleware.isAuthenticate.bind(authMiddleware), distributerController.editProfitSharingOfDistributedMovie.bind(distributerController));

router.get('/getallmovierequests', authMiddleware.isAuthenticate.bind(authMiddleware), distributerController.getAllMovieRequests.bind(distributerController));

router.patch('/approvemovierequest/:requestId', authMiddleware.isAuthenticate.bind(authMiddleware), distributerController.approveMovieRequest.bind(distributerController));

router.patch('/rejectmovierequest/:requestId', authMiddleware.isAuthenticate.bind(authMiddleware), distributerController.rejectMovieRequest.bind(distributerController));

export default router;