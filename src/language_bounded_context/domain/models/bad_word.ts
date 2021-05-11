import IEntity from "../../../common/domain/models/i_entity";

export default class BadWord implements IEntity<BadWord> {
    constructor(mid: number, mname: string, mmeaning: string) {
        this.mid = mid;
        this.mname = mname;
        this.mmeaning = mmeaning;
    }

    fsameIdentityAs(other: BadWord): boolean {
        return this.mid == other.mid;
    }




    mid: number = 0;
    mname: string = "";
    mmeaning: string = "";
}