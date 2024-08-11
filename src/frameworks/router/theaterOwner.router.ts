import express, { Express, Router } from 'express';

import TheaterOwnerRepository from '../../adapters/repositories/theaterOwner.repository';
import TheaterOwnerUseCase from '../../usecase/theaterOwner.usecase';
import TheaterOwnerController from '../../adapters/controllers/theaterOwner.controller';

// utils
import JWTService from '../utils/jwtService.utils';

import AuthMiddleware from '../middleware/auth.middleware';

// interfaces
import ITheaterOwnerRepository from '../../interface/repositories/theaterOwnerRepository';
import ITheaterOwnerUseCase from '../../interface/usecase/theaterOwner.usecase';
import ITheaterOwnerController from '../../interface/controllers/theaterOwner.controller';
import IJWTService from '../../interface/utils/IJWTService';
import IAuthMiddleware from '../../interface/middlewares/authMiddleware.interface';

const router: Router = express.Router();

// services
const jwtService: IJWTService = new JWTService();

// middlewares
const authMiddleware: IAuthMiddleware = new AuthMiddleware("TheaterOwner", jwtService);

const theaterOwnerRepository: ITheaterOwnerRepository = new TheaterOwnerRepository();
const theaterOwnerUseCase: ITheaterOwnerUseCase = new TheaterOwnerUseCase(theaterOwnerRepository);
const theaterOwnerController: ITheaterOwnerController = new TheaterOwnerController(theaterOwnerUseCase);

router.get('/getdistributerlist', authMiddleware.isAuthenticate.bind(authMiddleware), theaterOwnerController.getDistributerList.bind(theaterOwnerController));

export default router;