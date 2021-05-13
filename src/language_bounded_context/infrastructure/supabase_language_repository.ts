import Failure from "../../common/datatypes/failure/failure";
import ILanguageRepository from "../domain/i_language_repository";
import Language from "../domain/models/language";
import * as Supabase from "@supabase/supabase-js"; 
import BadWord from "../domain/models/bad_word";

export default class SupabaseLanguageRepository implements ILanguageRepository {
    public async fstore(language: Language): Promise<void | Failure> {
        const client: Supabase.SupabaseClient = this.fgetClient();
        const upsertLanguageRes = await client.from("languages").upsert({"name" : language.mname});

        if(upsertLanguageRes.error != undefined)
            return new Failure("Failed to upsert language");

        const deleteBadWordsRes = await client.from("bad_words").delete().match({"language" : language.mname});

        if(deleteBadWordsRes.error != undefined)
            return new Failure("Failed to delete all bad words before inserting the new ones");
            
        for(const badWord of language.fgetAllBadWords()) {
            const badWordJSON: any = {
                "id" : badWord.mid, "language" : language.mname, "name" : badWord.mname, "meaning" : badWord.mmeaning
            };
            const insertBadWordsRes = await this.fgetClient().from("bad_words").insert(badWordJSON);

            if(insertBadWordsRes.error != undefined)
                return new Failure("Failed to insert new bad words");
        }
    }

    public async fget(name: string): Promise<Language | Failure | undefined> {
        const client: Supabase.SupabaseClient = this.fgetClient();

        const getLanguageRes = await client.from("languages").select().eq("name", name);

        if(getLanguageRes.error != undefined)
            return new Failure("Failed to get language from database");

        if(getLanguageRes == undefined)
            return undefined;
            
        const getBadWordsRes = await client.from("bad_words").select().eq("language", name);

        if(getBadWordsRes.error != undefined)
            return new Failure("Failed to get bad words from database");

        const badWords: BadWord[] = [];
        const badWordSQLs: any[] = getBadWordsRes.data;
        for(const badWordSQL of badWordSQLs)
            badWords.push(this.fJSONToBadWord(badWordSQL));
            
        return this.fJSONToLanguage(getLanguageRes.data[0], badWords);
    }

    public async fcheckAvailability(name: string): Promise<boolean | Failure> {
        const getLanguageRes: Language | undefined | Failure = await this.fget(name);
        if(getLanguageRes instanceof Failure)
            return getLanguageRes;

        return getLanguageRes != undefined;
    }

    public async fgetAllNames(): Promise<string[] | Failure> {
        const client: Supabase.SupabaseClient = this.fgetClient();

        const getLanguagesRes = await client.from("languages").select();

        if(getLanguagesRes.data == undefined)
            return new Failure("Failed to get all languages");
        

        return getLanguagesRes.data.map<string>((value, index, array) => value.name);
    }

    

    private fgetClient(): Supabase.SupabaseClient {
        return Supabase.createClient(
            "https://qpqzvtatkdlwiafbnyax.supabase.co", 
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDkwMjc1OCwiZXhwIjoxOTM2NDc4NzU4fQ.K50si2Fm6t_wABkn6nY9mIw8XfCY55qEzMfjEvrsw2c"
        );
    }

    private fJSONToBadWord(json: any): BadWord {
        return new BadWord(json.id, json.name, json.meaning);
    }

    private fJSONToLanguage(json: any, badWords: BadWord[]): Language {
        return new Language(json.name, badWords);
    }    
}