import IEntity from "../../../common/domain/models/i_entity";
import BadWord from "./bad_word";

export default class Language implements IEntity<Language> {
    public constructor(mname: String, badWords: BadWord[]) {
        this.mname = mname;

        for(const badWord of badWords)
            this.mbadWords.set(badWord.mid, badWord);
    }

    public fsameIdentityAs(other: Language): boolean {
        return this.mname == other.mname;
    }

    private getNewIdForBadWord(): number {
        if(this.mbadWords.size == 0)
            return 0;

        let r: number = -1;
        for (const badWord of this.mbadWords.values()) {
            if (badWord.mid > r)
                r = badWord.mid;
        }
        r++;

        return r;
    }
    
    public faddBadWord(name: string, meaning: string): void {
        let id: number = this.getNewIdForBadWord();        

        const badWord: BadWord = new BadWord(id, name, meaning);
        this.mbadWords.set(id, badWord);
    }    

    public fgetBadWordWith(name: string, meaning: string): BadWord | undefined {
        for(const badWord of this.mbadWords.values()) {
            if(badWord.mname == name && badWord.mmeaning == meaning)
                return badWord;
        }

        return undefined;
    }

    public fcontainsBadWord(name: string, meaning: string): boolean {
        return this.fgetBadWordWith(name, meaning) != undefined;
    }

    public fremoveBadWord(id: number): void {
        this.mbadWords.delete(id);
    }



    public mname: String = "";
    public mbadWords: Map<number, BadWord> = new Map<number, BadWord>();
}