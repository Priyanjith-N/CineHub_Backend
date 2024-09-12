import { isObjectIdOrHexString } from "mongoose";
import IMovie, { INowPlayingMovies } from "../entity/movie.entity";
import IMovieSchedule, { IMovieSchedulesForBooking, IMovieSchedulesWithTheaterDetails } from "../entity/movieSchedule.entity";
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import IUserRepository from "../interface/repositories/user.repository";
import IUserUseCase, { IHomeMovieData } from "../interface/usecase/user.usercase";
import IStripeService from "../interface/utils/IStripeService.utils";
import { IBookSeatCredentials, ICreateCheckoutSessionCredentials } from "../entity/user.entity";
import { ISeatLayout, ISeatPayAmountData } from "../entity/screen.entity";
import ITickets, { IPurchaseDetails, ITicketDetilas } from "../entity/tickets.entity";

export default class UserUseCase implements IUserUseCase {
    private userRepository: IUserRepository;
    private stripeService: IStripeService;

    constructor(userRepository: IUserRepository, stripeService: IStripeService) {
        this.userRepository = userRepository;
        this.stripeService = stripeService;
    }

    async getAllDataForHomePage(): Promise<IHomeMovieData | never> {
        try {
            const nowPlayingMovies: INowPlayingMovies[] = await this.userRepository.nowPlayingMovies();
            const recommendedMovies: IMovie[] = await this.userRepository.recommendedMovies();
            const upcommingMovies: IMovie[] = await this.userRepository.upcommingMovies();

            const data: IHomeMovieData = {
                nowPlayingMovies,
                recommendedMovies,
                upcommingMovies
            }

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async getMovieDetails(movieId: string | undefined): Promise<IMovie | never> {
        try {
            if(!movieId || !isObjectIdOrHexString(movieId)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const data: IMovie | null = await this.userRepository.getMovieDetails(movieId);

            if(!data) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async getAllShowsForAMovie(movieId: string | undefined): Promise<IMovieSchedulesWithTheaterDetails[] | never> {
        try {
            if(!movieId || !isObjectIdOrHexString(movieId)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return await this.userRepository.getAllShowsForAMovie(movieId);
        } catch (err: any) {
            throw err;
        }
    }

    async getTheaterScreenLayout(scheduleId: string | undefined): Promise<IMovieSchedulesForBooking | never> {
        try {
            if(!scheduleId || !isObjectIdOrHexString(scheduleId)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return await this.userRepository.getTheaterScreenLayout(scheduleId);
        } catch (err: any) {
            throw err;
        }
    }

    async createCheckoutSession(data: ICreateCheckoutSessionCredentials): Promise<string> {
        try {
            if(!data || !data.scheduleId || !isObjectIdOrHexString(data.scheduleId) || !data.selectedSeats || !data.selectedSeats.length) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const query: { [key: string]: boolean }[] = data.selectedSeats.map((seat) => {
                return {
                    [`seats.${seat.rowIdx}.${seat.colIdx}.isBooked`]: false
                }
            }); // query to check all selected seat are not booked if any one is booked or true it returns null

            const movieSchedule: IMovieSchedule | null = await this.userRepository.isSeatTakenOrBooked(data.scheduleId, query);

            if(!movieSchedule) throw new RequiredCredentialsNotGiven('Some or all selected seats are booked. Please select new seats');

            const map: Map<string, ISeatPayAmountData> = new Map<string, ISeatPayAmountData>();

            data.selectedSeats.forEach((seat) => {
                const seatInfo = movieSchedule.seats[seat.rowIdx][seat.colIdx];

                if(!seatInfo) throw new RequiredCredentialsNotGiven('Seat Error');

                if(map.has(seatInfo.category)) {
                    const value = map.get(seatInfo.category)!;

                    value.quantity += 1;

                    map.set(seatInfo.category, value);
                }else{
                    map.set(seatInfo.category, { category: `${ seatInfo.category.toUpperCase() } Seat`, price: seatInfo.price, quantity: 1 });
                }
            });

            const itemData: ISeatPayAmountData[] = Array.from(map.values());

            itemData.push({
                category: 'SERVICE Charge',
                price: 20,
                quantity: data.selectedSeats.length
            });
            
            return await this.stripeService.createCheckoutSessionForBookingSeat(data.scheduleId, itemData);
        } catch (err: any) {
            throw err;
        }
    }

    async bookSeat(bookSeatData: IBookSeatCredentials | undefined, userId: string | undefined, checkoutSessionId: string | undefined): Promise<void> {
        try {
            if(!bookSeatData || !bookSeatData.scheduleId || !isObjectIdOrHexString(bookSeatData.scheduleId) || !bookSeatData.selectedSeats || !bookSeatData.selectedSeats.length || !bookSeatData.sessionId || !bookSeatData.userId || !userId || !isObjectIdOrHexString(bookSeatData.userId) || bookSeatData.userId.toString() !== userId.toString() || !checkoutSessionId || bookSeatData.sessionId !== checkoutSessionId) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const checkoutSession = await this.stripeService.retriveCheckoutSession(checkoutSessionId);

            if(checkoutSession.payment_status !== "paid") throw new RequiredCredentialsNotGiven('Not Paid');
            
            const updateQuery: { [key: string]: boolean | string } = {}

            bookSeatData.selectedSeats.forEach((seat) => {
                updateQuery[`seats.${seat.rowIdx}.${seat.colIdx}.isBooked`] = true;
                updateQuery[`seats.${seat.rowIdx}.${seat.colIdx}.bookedUserId`] = userId;
            });

            const movieScheduleData: IMovieSchedule | null = await this.userRepository.getScheduleById(bookSeatData.scheduleId);

            if(!movieScheduleData) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const seatDetails: ISeatLayout[] = [];

            const map: Map<string, IPurchaseDetails> = new Map<string, IPurchaseDetails>();

            bookSeatData.selectedSeats.forEach((seat) => {
                const seatInfo = movieScheduleData.seats[seat.rowIdx][seat.colIdx];

                if(!seatInfo) throw new RequiredCredentialsNotGiven('Seat Error');

                // saving each selected seat details
                seatDetails.push({
                    category: seatInfo.category,
                    name: seatInfo.name,
                    price: seatInfo.price
                });

                if(map.has(seatInfo.category)) {
                    const value = map.get(seatInfo.category)!;

                    value.quantity += 1;

                    map.set(seatInfo.category, value);
                }else{
                    map.set(seatInfo.category, { itemName: `${ seatInfo.category.toUpperCase() } Seat`, price: seatInfo.price, quantity: 1 });
                }
            });

            const purchaseDetails: IPurchaseDetails[] = Array.from(map.values());

            purchaseDetails.push({
                itemName: 'SERVICE Charge',
                price: 20,
                quantity: bookSeatData.selectedSeats.length
            });
            
            const screen = await this.userRepository.getTheaterIdFormScreen(movieScheduleData.screenId as string);

            if(!screen) throw new RequiredCredentialsNotGiven('screen eroor'); // screen id error.

            const ticketData: ITickets = {
                userId,
                date: movieScheduleData.date,
                movieId: movieScheduleData.movieId,
                time: movieScheduleData.startTime,
                paymentIntentId: checkoutSession.payment_intent! as string,
                scheduleId: movieScheduleData._id,
                purchaseDetails,
                selectedSeatsIdx: bookSeatData.selectedSeats,
                class: Array.from(map.keys()), // key are unique so class are unique
                screenId: movieScheduleData.screenId,
                seatDetails,
                paymentStatus: "Successfull",
                ticketStatus: "Active",
                totalPaidAmount: checkoutSession.amount_total! / 100,
                theaterId: screen.theaterId
            }

            await this.userRepository.bookSeat(bookSeatData.scheduleId, updateQuery); // make the seat as booked by the user.

            await this.userRepository.saveTicket(ticketData); // save tickets
        } catch (err: any) {
            throw err;
        }
    }

    async getAllActiveTickets(userId: string | undefined): Promise<ITicketDetilas[] | never> {
        try {
            if(!userId || !isObjectIdOrHexString(userId)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return this.userRepository.getAllActiveTickets(userId);
        } catch (err: any) {
            throw err;
        }
    }
}