// interfaces
import { IDistributerList } from "../entity/distributer.entity";
import ITheaterOwnerRepository from "../interface/repositories/theaterOwnerRepository";
import ITheaterOwnerUseCase from "../interface/usecase/theaterOwner.usecase";

export default class TheaterOwnerUseCase implements ITheaterOwnerUseCase {
    private theaterOwnerRepository: ITheaterOwnerRepository;

    constructor(theaterOwnerRepository: ITheaterOwnerRepository) {
        this.theaterOwnerRepository = theaterOwnerRepository;
    }

    async getDistributerList(): Promise<IDistributerList[] | never> {
        try {
            return await this.theaterOwnerRepository.getDistributerList();
        } catch (err: any) {
            throw err;
        }
    }
}