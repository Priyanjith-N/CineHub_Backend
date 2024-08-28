import express, { Express, Router } from 'express';

import TheaterOwnerRepository from '../../adapters/repositories/theaterOwner.repository';
import TheaterOwnerUseCase from '../../usecase/theaterOwner.usecase';
import TheaterOwnerController from '../../adapters/controllers/theaterOwner.controller';

// utils
import JWTService from '../utils/jwtService.utils';
import CloudinaryService from '../utils/cloudinaryService.utils';

import AuthMiddleware from '../middleware/auth.middleware';

// interfaces
import ITheaterOwnerRepository from '../../interface/repositories/theaterOwnerRepository.interface';
import ITheaterOwnerUseCase from '../../interface/usecase/theaterOwner.usecase';
import ITheaterOwnerController from '../../interface/controllers/theaterOwner.controller';
import IJWTService from '../../interface/utils/IJWTService';
import IAuthMiddleware from '../../interface/middlewares/authMiddleware.interface';
import ICloudinaryService from '../../interface/utils/ICloudinaryService';

const router: Router = express.Router();

// services
const jwtService: IJWTService = new JWTService();
const cloudinaryService: ICloudinaryService = new CloudinaryService();

// middlewares
const authMiddleware: IAuthMiddleware = new AuthMiddleware("TheaterOwner", jwtService);

const theaterOwnerRepository: ITheaterOwnerRepository = new TheaterOwnerRepository();
const theaterOwnerUseCase: ITheaterOwnerUseCase = new TheaterOwnerUseCase(theaterOwnerRepository, cloudinaryService);
const theaterOwnerController: ITheaterOwnerController = new TheaterOwnerController(theaterOwnerUseCase);

// router middleware
router.use(authMiddleware.isAuthenticate.bind(authMiddleware));

router.get('/getdistributerlist', theaterOwnerController.getDistributerList.bind(theaterOwnerController));

router.get('/getmovielist/:distributerId', theaterOwnerController.getMovieListOfDistributer.bind(theaterOwnerController));

router.post('/addtheater', theaterOwnerController.addTheater.bind(theaterOwnerController));

router.get('/theater', theaterOwnerController.getAllTheaters.bind(theaterOwnerController));

router.get('/theater/:theaterId', theaterOwnerController.getTheater.bind(theaterOwnerController));

router.post('/addScreen/:theaterId', theaterOwnerController.addScreen.bind(theaterOwnerController));

router.get('/screens/:theaterId', theaterOwnerController.getScreens.bind(theaterOwnerController));

router.post('/requestmovie', theaterOwnerController.requestForMovie.bind(theaterOwnerController));

router.get('/getallmovierequest', theaterOwnerController.getAllMovieRequests.bind(theaterOwnerController));

router.get('/getallmoviesfromcollection', theaterOwnerController.getAllMoviesFromOwnerCollection.bind(theaterOwnerController));

router.post('/addMovieSchedule', theaterOwnerController.addMovieSchedule.bind(theaterOwnerController));

router.get('/getAllSchedulesOn', theaterOwnerController.getAllSchedulesBasedOnDate.bind(theaterOwnerController));

export default router;