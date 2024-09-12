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
import IStripeService from '../../interface/utils/IStripeService.utils';
import StripeService from '../utils/stripeService.utils';

const router: Router = express.Router();

// services
const jwtService: IJWTService = new JWTService();
const stripeService: IStripeService = new StripeService();

// middlewares
const authMiddleware: IAuthMiddleware = new AuthMiddleware("User", jwtService);

const userRepository: IUserRepository = new UserRepository();
const userUseCase: IUserUseCase = new UserUseCase(userRepository, stripeService);
const userController: IUserController = new UserController(userUseCase);

router.get("/getdataforhome", userController.getDataForHomePage.bind(userController));

router.get("/getmoviedetails/:movieId", userController.getMovieDetails.bind(userController));

router.get("/getAllShowsForAMovie/:movieId", userController.getAllShowsForAMovie.bind(userController));

router.get("/getTheaterScreenLayout/:scheduleId", userController.getTheaterScreenLayout.bind(userController));

// router middleware
router.use(authMiddleware.isAuthenticate.bind(authMiddleware));

router.post('/create-checkout-session', userController.createCheckoutSession.bind(userController));

router.post('/bookseat', userController.bookSeat.bind(userController));

router.get('/activetickets', userController.getAllActiveTickets.bind(userController)); // get all the booked tickets for movie

router.patch('/cancelticket/:ticketId', userController.cancelTicket.bind(userController)); // cancel active ticket for movie

export default router;