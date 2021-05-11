export default class Command {
    constructor(name: string, mparameters: string[]) {
        this.mname = name;
        this.mparameters = mparameters;
    }

    public ftoString(): string {
        let r: string = `!${this.mname}`;

        for(const parameter of this.mparameters)
            r += ` ${parameter}`;        

        return r;
    }

    public readonly mname: string = "";
    public readonly mparameters: string[] = [];
}