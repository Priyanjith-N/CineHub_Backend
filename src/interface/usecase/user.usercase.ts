import IMovie from "../../entity/movie.entity";
import { IMovieSchedulesForBooking, IMovieSchedulesWithTheaterDetails } from "../../entity/movieSchedule.entity";
import { ITicketDetilas } from "../../entity/tickets.entity";
import { IBookSeatCredentials, ICreateCheckoutSessionCredentials, IUserProfile } from "../../entity/user.entity";

export default interface IUserUseCase {
    getAllDataForHomePage(): Promise<IHomeMovieData | never>;
    getMovieDetails(movieId: string | undefined): Promise<IMovie | never>;
    getAllShowsForAMovie(movieId: string | undefined): Promise<IMovieSchedulesWithTheaterDetails[] | never>;
    getTheaterScreenLayout(scheduleId: string | undefined): Promise<IMovieSchedulesForBooking | never>;
    createCheckoutSession(data: ICreateCheckoutSessionCredentials): Promise<string>;
    bookSeat(bookSeatData: IBookSeatCredentials | undefined, userId: string | undefined, checkoutSessionId: string | undefined): Promise<string | never>;
    getAllActiveTickets(userId: string | undefined): Promise<ITicketDetilas[] | never>;
    cancelTicket(ticketId: string | undefined, userId: string | undefined): Promise<void | never>;
    getAllTransactionList(userId: string | undefined): Promise<ITicketDetilas[] | never>;
    getTicketDetails(ticketId: string | undefined, userId: string | undefined): Promise<ITicketDetilas | never>;
    getUserProfileData(userId: string | undefined): Promise<IUserProfile | never>;
}

export interface IHomeMovieData {
    nowPlayingMovies: IMovie[];
    recommendedMovies: IMovie[];
    upcommingMovies: IMovie[];
    streamingMovies: IMovie[];
}