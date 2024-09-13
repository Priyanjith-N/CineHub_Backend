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

// router middleware
router.use(authMiddleware.isAuthenticate.bind(authMiddleware));

router.get('/getallavailablemovies', distributerController.getAllAvailableMovies.bind(distributerController));

router.patch('/distributemovie/:id', distributerController.distributeMovie.bind(distributerController));

router.get('/getmymovies', distributerController.getMyMovies.bind(distributerController));

router.patch('/editprofitsharingofdistributedmovie/:id', distributerController.editProfitSharingOfDistributedMovie.bind(distributerController));

router.get('/getallmovierequests', distributerController.getAllMovieRequests.bind(distributerController));

router.patch('/approvemovierequest/:requestId', distributerController.approveMovieRequest.bind(distributerController));

router.patch('/rejectmovierequest/:requestId', distributerController.rejectMovieRequest.bind(distributerController));

router.post('/addstreaming', distributerController.addStreaming.bind(distributerController));

router.get('/getallstreamingmoviedetails', distributerController.getAllStreamingMovieDetails.bind(distributerController));

export default router;