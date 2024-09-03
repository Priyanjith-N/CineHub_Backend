import express, { NextFunction, Request, Response, Router } from 'express';

import UserController from '../../adapters/controllers/user.controller';
import UserUseCase from '../../usecase/user.usecase';
import UserRepository from '../../adapters/repositories/user.repository';

// import utils
import JWTService from '../utils/jwtService.utils';

import AuthMiddleware from '../middleware/auth.middleware';

// interfaces
import IUserRepository from '../../interface/repositories/user.repository';
import IUserUseCase from '../../interface/usecase/user.usercase';
import IUserController from '../../interface/controllers/user.controller.interface';
import IJWTService from '../../interface/utils/IJWTService';
import IAuthMiddleware from '../../interface/middlewares/authMiddleware.interface';

const router: Router = express.Router();

// services
const jwtService: IJWTService = new JWTService();

// middlewares
const authMiddleware: IAuthMiddleware = new AuthMiddleware("User", jwtService);

const userRepository: IUserRepository = new UserRepository();
const userUseCase: IUserUseCase = new UserUseCase(userRepository);
const userController: IUserController = new UserController(userUseCase);

router.get("/getdataforhome", userController.getDataForHomePage.bind(userController));

router.get("/getmoviedetails/:movieId", userController.getMovieDetails.bind(userController));

router.get("/getAllShowsForAMovie/:movieId", userController.getAllShowsForAMovie.bind(userController));

router.get("/getTheaterScreenLayout/:scheduleId", userController.getTheaterScreenLayout.bind(userController));

// router middleware
router.use(authMiddleware.isAuthenticate.bind(authMiddleware));

export default router;