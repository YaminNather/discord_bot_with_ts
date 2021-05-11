import IEntity from "../../../common/domain/models/i_entity";
import BadWord from "./bad_word";

export default class Language implements IEntity<Language> {
    public constructor(mname: String, mbadWords: BadWord[]) {
        this.mname = mname;
        this.mbadWords = mbadWords;
    }

    public fsameIdentityAs(other: Language): boolean {
        return this.mname == other.mname;
    }

    private getNewIdForBadWord(): number {
        if(this.mbadWords.length == 0)
            return 0;

        let r: number = this.mbadWords[0].mid;
        for (let i: number = 1; i < this.mbadWords.length; i++) {
            if (r < this.mbadWords[i].mid)
                r = this.mbadWords[i].mid;
        }
        r++;

        return r;
    }
    
    public faddBadWord(name: string, meaning: string): void {
        let id: number = this.getNewIdForBadWord();        

        const badWord: BadWord = new BadWord(id, name, meaning);
        this.mbadWords.push(badWord);
    }
    
    public fcontainsBadWord(name: string, meaning: string): boolean {
        return this.mbadWords.some( (value, _0, _1) => value.mname == name && value.mmeaning == meaning );
    }



    public mname: String = "";
    public mbadWords: BadWord[] = [];
}