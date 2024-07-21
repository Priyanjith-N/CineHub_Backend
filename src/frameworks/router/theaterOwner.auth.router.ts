import express, { Router } from 'express';

import TheaterOwnerAuthenticationController from '../../adapters/controllers/theaterOwner.auth.controller';
import TheaterOwnerAuthUseCase from '../../usecase/theaterOwner.auth.usecase';
import TheaterOwnerAuthRepository from '../../adapters/repositories/theaterOwner.auth.repository';

// import utils
import HashingService from "../utils/hashingService.utils";
import OTPService from "../utils/otpService.utils";
import EmailService from "../utils/emailService.utils";
import JWTService from "../utils/jwtService.utils";

// importing collections
import TheaterOwners from '../models/theaterOwner.model';
import OTPs from "../models/otp.model";


// interfaces
import { ITheaterOwnerAuthenticationController } from '../../interface/controllers/theaterOwner.IAuth.controller';
import ITheaterOwnerAuthUseCase from '../../interface/usecase/theaterOwner.IAuth.usecase';
import ITheaterOwnerAuthRepository from '../../interface/repositories/theaterOwner.IAuth.repository';
import IHashingService from "../../interface/utils/IHashingService";
import IOTPService from "../../interface/utils/IOTPService";
import IEmailService from "../../interface/utils/IEmailService";
import IJWTService from "../../interface/utils/IJWTService";

const router: Router = express.Router();

// services
const hashingService: IHashingService = new HashingService();
const otpService: IOTPService = new OTPService();
const emailService: IEmailService = new EmailService();
const jwtService: IJWTService = new JWTService();

const theaterOwnerAuthRepository: ITheaterOwnerAuthRepository = new TheaterOwnerAuthRepository(TheaterOwners, OTPs)
const theaterOwnerAuthUseCase: ITheaterOwnerAuthUseCase = new TheaterOwnerAuthUseCase(theaterOwnerAuthRepository, hashingService, otpService, emailService, jwtService);
const theaterOwnerAuthController: ITheaterOwnerAuthenticationController = new TheaterOwnerAuthenticationController(theaterOwnerAuthUseCase);

router.post('/login', theaterOwnerAuthController.handleLoginRequest.bind(theaterOwnerAuthController));

export default router;