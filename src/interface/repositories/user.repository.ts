import IMovie, { INowPlayingMovies } from "../../entity/movie.entity";
import IMovieSchedule, { IMovieSchedulesForBooking, IMovieSchedulesWithTheaterDetails } from "../../entity/movieSchedule.entity";
import ITickets, { ITicketDetilas } from "../../entity/tickets.entity";

export default interface IUserRepository {
    upcommingMovies(): Promise<IMovie[] | never>;
    recommendedMovies(): Promise<IMovie[] | never>;
    nowPlayingMovies(): Promise<INowPlayingMovies[] | never>;
    getMovieDetails(movieId: string): Promise<IMovie | null | never>;
    getAllShowsForAMovie(movieId: string): Promise<IMovieSchedulesWithTheaterDetails[] | never>;
    getTheaterScreenLayout(scheduleId: string): Promise<IMovieSchedulesForBooking | never>;
    isSeatTakenOrBooked(scheduleId: string, query: { [key: string]: boolean }[]): Promise<IMovieSchedule | null | never>;
    bookSeat(scheduleId: string, updateQuery: { [key: string]: boolean | string }): Promise<void | never>;
    getScheduleById(scheduleId: string): Promise<IMovieSchedule | null | never>;
    getTheaterIdFormScreen(screenId: string): Promise<{ theaterId: string } | null | never>;
    saveTicket(saveData: ITickets): Promise<void | never>;
    getAllActiveTickets(userId: string): Promise<ITicketDetilas[] | never>;
}