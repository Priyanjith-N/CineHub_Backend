import { IDistributerList } from "../../entity/distributer.entity";

export default interface ITheaterOwnerRepository {
    getDistributerList(): Promise<IDistributerList[] | never>;
}