// interfaces
import { IDistributerList } from "../../entity/distributer.entity";

export default interface ITheaterOwnerUseCase {
    getDistributerList(): Promise<IDistributerList[] | never>;
}