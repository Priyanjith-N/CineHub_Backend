import express, { Express, Router } from 'express';

import DistributerRepository from '../../adapters/repositories/distributer.repository';
import DistributerUseCase from '../../usecase/distributer.usecase';
import DistributerController from '../../adapters/controllers/distributer.controller';

// utils
import JWTService from '../utils/jwtService.utils';

import AuthMiddleware from '../middleware/auth.middleware';

// interfaces
import IDistributerRepository from '../../interface/repositories/distributer.repository';
import IDistributerUseCase from '../../interface/usecase/distributer.usecase.interface';
import IDistributerController from '../../interface/controllers/distributer.controller.interface';
import IAuthMiddleware from '../../interface/middlewares/authMiddleware.interface';
import IJWTService from '../../interface/utils/IJWTService';

const router: Router = express.Router();

// services
const jwtService: IJWTService = new JWTService();

// middlewares
const authMiddleware: IAuthMiddleware = new AuthMiddleware("Distributer", jwtService);

const distributerRepository: IDistributerRepository = new DistributerRepository();
const distributerUseCase: IDistributerUseCase = new DistributerUseCase(distributerRepository);
const distributerController: IDistributerController = new DistributerController(distributerUseCase);

router.get('/getallavailablemovies', distributerController.getAllAvailableMovies.bind(distributerController));

router.patch('/distributemovie/:id', authMiddleware.isAuthenticate.bind(authMiddleware), distributerController.distributeMovie.bind(distributerController));

router.get('/getmymovies', authMiddleware.isAuthenticate.bind(authMiddleware), distributerController.getMyMovies.bind(distributerController));

export default router;