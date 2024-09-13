import mongoose from "mongoose";
import IMovie, { INowPlayingMovies } from "../../entity/movie.entity";
import Movies from "../../frameworks/models/movie.model";
import MovieSchedules from "../../frameworks/models/movieSchedule.model";
import IUserRepository from "../../interface/repositories/user.repository";
import IMovieSchedule, { IMovieSchedulesForBooking, IMovieSchedulesWithTheaterDetails } from "../../entity/movieSchedule.entity";
import Screens from "../../frameworks/models/screen.model";
import ITickets, { ISaveCredentionOfTickets, ITicketDetilas } from "../../entity/tickets.entity";
import Tickets from "../../frameworks/models/tickets.model";
import MovieStreaming from "../../frameworks/models/movieStreaming.mode";
import { IMovieStreamingDetails } from "../../entity/movieStreaming.entity";

export default class UserRepository implements IUserRepository {
    async upcommingMovies(): Promise<IMovie[] | never> {
        try {
            return await Movies.find({ releaseDate: { $gt: new Date(Date.now()) } });
        } catch (err: any) {
            throw err;
        }
    }

    async streamingMovies(): Promise<IMovieStreamingDetails[] | never> {
        try {
          const agg = [
            {
              $lookup: {
                from: 'movies', 
                localField: 'movieId', 
                foreignField: '_id', 
                as: 'movieData'
              }
            }, 
            {
              $unwind: {
                path: '$movieData'
              }
            }
          ]

          return await MovieStreaming.aggregate(agg);
        } catch (err: any) {
            throw err;
        }
    }

    async recommendedMovies(): Promise<IMovie[] | never> {
        try {
            return [];
        } catch (err: any) {
            throw err;
        }
    }

    async nowPlayingMovies(): Promise<INowPlayingMovies[] | never> {
        try {
            const agg = [
              {
                $group: {
                  _id: '$movieId'
                }
              }, 
              {
                $project: {
                  movieId: '$_id', 
                  _id: 0
                }
              }, 
              {
                $lookup: {
                  from: 'movies', 
                  localField: 'movieId', 
                  foreignField: '_id', 
                  as: 'movieData'
                }
              }, 
              {
                $unwind: {
                  path: '$movieData'
                }
              }, 
              {
                $project: {
                  movieId: 0
                }
              }
            ]

            return await MovieSchedules.aggregate(agg);
        } catch (err: any) {
            throw err;
        }
    }

    async getMovieDetails(movieId: string): Promise<IMovie | null | never> {
        try {
            return await Movies.findOne({ _id: movieId });
        } catch (err: any) {
            throw err;
        }
    }

    async getAllShowsForAMovie(movieId: string): Promise<IMovieSchedulesWithTheaterDetails[] | never> {
        try {
          const agg = [
            {
              $match: {
                movieId: new mongoose.Types.ObjectId(movieId),
                date: {
                  $gte: new Date(Date.now())
                }
              }
            },
            {
              $lookup: {
                from: 'screens', 
                localField: 'screenId', 
                foreignField: '_id', 
                as: 'screenData'
              }
            }, 
            {
              $unwind: {
                path: '$screenData'
              }
            }, 
            {
              $lookup: {
                from: 'theaters', 
                localField: 'screenData.theaterId', 
                foreignField: '_id', 
                as: 'theaterData'
              }
            }, 
            {
              $unwind: {
                path: '$theaterData'
              }
            }, 
            {
              $group: {
                _id: {
                  date: '$date', 
                  theaterId: '$theaterData._id'
                }, 
                scheduledDate: {
                  $first: '$date'
                }, 
                theaterData: {
                  $first: '$theaterData'
                }, 
                schedules: {
                  $push: {
                    scheduleId: '$_id', 
                    startTime: '$startTime', 
                    endTime: '$endTime',
                    availableSeats: '$availableSeats'
                  }
                }
              }
            }, 
            {
              $project: {
                _id: 0
              }
            }
          ]

          return await MovieSchedules.aggregate(agg);
        } catch (err: any) {
            throw err;
        }
    }

    async getTheaterScreenLayout(scheduleId: string): Promise<IMovieSchedulesForBooking | never> {
      try {
        const agg = [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(scheduleId)
            }
          },
          {
            $lookup: {
              from: 'movies', 
              localField: 'movieId', 
              foreignField: '_id', 
              as: 'movieData'
            }
          }, {
            $unwind: {
              path: '$movieData'
            }
          }, 
          {
            $lookup: {
              from: 'screens', 
              localField: 'screenId', 
              foreignField: '_id', 
              as: 'screenData'
            }
          }, 
          {
            $unwind: {
              path: '$screenData'
            }
          },
          {
            $lookup: {
              from: 'theaters', 
              localField: 'screenData.theaterId', 
              foreignField: '_id', 
              as: 'theaterData'
            }
          }, {
            $unwind: {
              path: '$theaterData'
            }
          }
        ];
  
        const [ schedule ]: IMovieSchedulesForBooking[] = await MovieSchedules.aggregate(agg);
  
        return schedule;
      } catch (err: any) {
        throw err;
      }
    }

    async isSeatTakenOrBooked(scheduleId: string, query: { [key: string]: boolean }[]): Promise<IMovieSchedule | null | never> {
      try {
        return await MovieSchedules.findOne({ _id: scheduleId, $and: query });
      } catch (err: any) {
        throw err;
      }
    }

    async bookSeatOrMakeSeatAvaliable(scheduleId: string, updateQuery: { [key: string]: boolean | null | string }): Promise<void | never> {
      try {
        await MovieSchedules.updateOne({ _id: scheduleId }, {$set: updateQuery});
      } catch (err: any) {
        throw err;
      }
    }

    async getScheduleById(scheduleId: string): Promise<IMovieSchedule | null | never> {
      try {
        return await MovieSchedules.findOne({ _id: scheduleId })!;
      } catch (err: any) {
        throw err;
      }
    }

    async getTheaterIdFormScreen(screenId: string): Promise<{ theaterId: string } | null | never> {
      try {
        return await Screens.findOne({ _id: screenId }, { theaterId: 1, _id: 0 });
      } catch (err: any) {
        throw err;
      }
    }

    async saveTicket(saveData: ISaveCredentionOfTickets): Promise<string | never> {
      try {
        const newTicketData = new Tickets({
          userId: saveData.userId,
          scheduleId: saveData.scheduleId,
          paymentIntentId: saveData.paymentIntentId,
          date: saveData.date,
          time: saveData.time,
          movieId: saveData.movieId,
          theaterId: saveData.theaterId,
          screenId: saveData.screenId,
          class: saveData.class,
          purchaseDetails: saveData.purchaseDetails,
          totalPaidAmount: saveData.totalPaidAmount,
          selectedSeatsIdx: saveData.selectedSeatsIdx,
          seatDetails: saveData.seatDetails
        });

        await newTicketData.save();

        return newTicketData._id as string;
      } catch (err: any) {
        throw err;
      }
    }

    private async changeTicketStatus() {
      try {
        await Tickets.updateOne({ date: { $lt: new Date(Date.now()) } }, { $set: { ticketStatus: "Succeed" } });
      } catch (err: any) {
        throw err;
      }
    }

    async getAllActiveTickets(userId: string): Promise<ITicketDetilas[] | never> {
      try {
        await this.changeTicketStatus();

        const agg = [
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId),
              ticketStatus: 'Active'
            }
          },
          {
            $lookup: {
              from: 'movies', 
              localField: 'movieId', 
              foreignField: '_id', 
              as: 'movieData'
            }
          }, 
          {
            $unwind: {
              path: '$movieData'
            }
          }, 
          {
            $lookup: {
              from: 'theaters', 
              localField: 'theaterId', 
              foreignField: '_id', 
              as: 'theaterData'
            }
          }, 
          {
            $unwind: {
              path: '$theaterData'
            }
          }, 
          {
            $lookup: {
              from: 'screens', 
              localField: 'screenId', 
              foreignField: '_id', 
              as: 'screenData'
            }
          }, 
          {
            $unwind: {
              path: '$screenData'
            }
          }
        ];

        return await Tickets.aggregate(agg);
      } catch (err: any) {
        throw err;
      }
    }

    async getTicketById(ticketId: string): Promise<ITickets | null | never> {
      try {
        return await Tickets.findOne({ _id: ticketId });
      } catch (err: any) {
        throw err;
      }
    }

    async cancelTicket(ticketId: string): Promise<void | never> {
      try {
        await Tickets.updateOne({ _id: ticketId }, { $set: { ticketStatus: "Canceled", paymentStatus: "Refunded" } })
      } catch (err: any) {
        throw err;
      }
    }

    async getAllTransactionList(userId: string): Promise<ITicketDetilas[] | never> {
      try {
        await this.changeTicketStatus();

        const agg = [
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId)
            }
          },
          {
            $lookup: {
              from: 'movies', 
              localField: 'movieId', 
              foreignField: '_id', 
              as: 'movieData'
            }
          }, 
          {
            $unwind: {
              path: '$movieData'
            }
          }, 
          {
            $lookup: {
              from: 'theaters', 
              localField: 'theaterId', 
              foreignField: '_id', 
              as: 'theaterData'
            }
          }, 
          {
            $unwind: {
              path: '$theaterData'
            }
          }, 
          {
            $lookup: {
              from: 'screens', 
              localField: 'screenId', 
              foreignField: '_id', 
              as: 'screenData'
            }
          }, 
          {
            $unwind: {
              path: '$screenData'
            }
          }
        ];

        return await Tickets.aggregate(agg);
      } catch (err: any) {
        throw err;
      }
    }

    async getTicketDetailsById(ticketId: string): Promise<ITicketDetilas | undefined | never> {
      try {
        const agg = [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(ticketId)
            }
          },
          {
            $lookup: {
              from: 'movies', 
              localField: 'movieId', 
              foreignField: '_id', 
              as: 'movieData'
            }
          }, 
          {
            $unwind: {
              path: '$movieData'
            }
          }, 
          {
            $lookup: {
              from: 'theaters', 
              localField: 'theaterId', 
              foreignField: '_id', 
              as: 'theaterData'
            }
          }, 
          {
            $unwind: {
              path: '$theaterData'
            }
          }, 
          {
            $lookup: {
              from: 'screens', 
              localField: 'screenId', 
              foreignField: '_id', 
              as: 'screenData'
            }
          }, 
          {
            $unwind: {
              path: '$screenData'
            }
          }
        ];

        const [ data ]: ITicketDetilas[] = await Tickets.aggregate(agg);

        return data;
      } catch (err: any) {
        throw err;
      }
    }
}