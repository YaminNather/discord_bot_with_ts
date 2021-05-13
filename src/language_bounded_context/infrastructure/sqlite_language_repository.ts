import * as SQLite3 from "sqlite3";
import * as SQLite from "sqlite";

import Failure from "../../common/datatypes/failure/failure";
import ILanguageRepository from "../domain/i_language_repository";
import Language from "../domain/models/language";

import BadWord from "../domain/models/bad_word";

export default class SQLiteLanguageRepository implements ILanguageRepository {    
    constructor() {
        this.fget = this.fget.bind(this);
    }

    public async fstore(language: Language): Promise<void | Failure> {
        const getDatabaseResponse : SQLite.Database | Failure = await this.fgetDatabase();
        
        if(getDatabaseResponse instanceof Failure)
            return getDatabaseResponse;
        
        const database: SQLite.Database = getDatabaseResponse as SQLite.Database;

        const createTablesIfNotPresentResponse : void | Failure = await this.fcreateTablesIfNotPresent(database);
        
        if(createTablesIfNotPresentResponse instanceof Failure)
            return createTablesIfNotPresentResponse;              

        await database.run(`REPLACE INTO languages(name) VALUES('${language.mname}')`);
        
        const storeBadWordsResponse: void | Failure  = await this.fstoreBadWords(language, database);
        if(storeBadWordsResponse instanceof Failure)
            return storeBadWordsResponse;


        await database.close();
    }
        
    private async fstoreBadWords(language: Language, database: SQLite.Database): Promise<void | Failure> {
        try
        {
            await database.run(`DELETE FROM bad_words WHERE language = '${language.mname}'`);

            for(const badWord of language.mbadWords.values()) {
                await database.run(
                    `INSERT INTO bad_words(id, language, name, meaning) 
                    VALUES(${badWord.mid}, '${language.mname}', '${badWord.mname}', '${badWord.mmeaning}');`
                );
            }
        }
        catch(e) {
            return new Failure(SQLiteLanguageRepository.sMUCOULDNTUPDATEBADWORDSFAILUREMSG);
        }
    }





    public async fget(name: String): Promise<(Language | undefined) | Failure> {
        const getDatabaseResponse: SQLite.Database | Failure = await this.fgetDatabase();
        if(getDatabaseResponse instanceof Failure)
            return getDatabaseResponse;        

        const database: SQLite.Database = getDatabaseResponse;

        const createTablesIfNotPresentResponse: void | Failure = await this.fcreateTablesIfNotPresent(database);
        if(createTablesIfNotPresentResponse instanceof Failure)
            return createTablesIfNotPresentResponse;

        let languageFromSQL: any = await database.get(`SELECT * from ${this.mLANGUAGESTABLENAME} WHERE name = '${name}'`);
        
        if(languageFromSQL == undefined) 
            return undefined;
        
        const badWordsFromSQL: any[] = await database.all(`SELECT * from ${this.mBADWORDSTABLENAME} WHERE language = '${name}';`);

        let badWords: BadWord[];
        if(badWordsFromSQL.length == 0)
            badWords = [];        
        else
            badWords = this.fmapBadWordsFromSQLToObjects(badWordsFromSQL);        
        
        const r: Language = this.fmapLanguageFromSQLToObject(languageFromSQL, badWords);

        await database.close();

        return r;
    }

    private fmapBadWordsFromSQLToObjects(fromSQL: any[]): BadWord[] {
        const r: BadWord[] = [];
        
        for(let i: number = 0; i < fromSQL.length; i++) {
            const badWordFromSQL: any = this.fmapBadWordFromSQLToObject(fromSQL[i]);
            r.push(badWordFromSQL);
        }

        return r;
    }

    private fmapBadWordFromSQLToObject(fromSQL: any): BadWord {
        const id: number = fromSQL["id"];
        const name: string = fromSQL["name"];
        const meaning: string = fromSQL["meaning"];

        return new BadWord(id, name, meaning);
    }

    private fmapLanguageFromSQLToObject(languageFromSQL: any, badWords: BadWord[]): Language {
        const name: string = languageFromSQL["name"];
        
        return new Language(name, badWords);        
    }




    public async fcheckAvailability(name: String): Promise<boolean | Failure> {
        const getLanguageResponse: Language | undefined | Failure = await this.fget(name);

        if(getLanguageResponse instanceof Failure)
            return getLanguageResponse;

        return getLanguageResponse != undefined;
    }

    public async fgetAllNames(): Promise<string[] | Failure> {
        const getDatabaseRes: SQLite.Database | Failure = await this.fgetDatabase();

        if(getDatabaseRes instanceof Failure)
            return getDatabaseRes;

        const database: SQLite.Database = getDatabaseRes;
        
        try {
            const langaugesFromSQL: any[] = await database.all(`SELECT * from languages;`);
            
            return langaugesFromSQL.map<string>((value, _0, _1) => value.name);
        }
        catch(e) {
            return new Failure(`Failed to get language names`);
        }     
    }



    private async fgetDatabase(): Promise<SQLite.Database | Failure> {
        try {
            return await SQLite.open({driver: SQLite3.Database, filename: this.mFILEPATH});
        }
        catch(e) {
            return new Failure(SQLiteLanguageRepository.smCOULDNTOPENDATABASEFAILUREMSG);
        }
    }

    private async fcreateTablesIfNotPresent(database: SQLite.Database) : Promise<void | Failure> {
        try {
            await database.run("CREATE TABLE IF NOT EXISTS languages(name TEXT PRIMARY KEY NOT NULL);");
            await database.run(
                `CREATE TABLE IF NOT EXISTS bad_words(
                    id NOT NULL, name TEXT NOT NULL, meaning TEXT NOT NULL, 
                    language REFERENCES languages(name) NOT NULL
                );`
            );
        }
        catch(e) {
            return new Failure(SQLiteLanguageRepository.smCREATETABLESFAILUREMSG);
        }
    }
    
    




    private readonly mFILEPATH: string = "D:/Yamin/Temp/Temporary database/languages.db";
    
    private readonly mLANGUAGESTABLENAME: string = "languages"; 
    private readonly mBADWORDSTABLENAME: string = "bad_words";
    
    public static readonly sMUCOULDNTUPDATEBADWORDSFAILUREMSG: string = "Couldnt update bad words";
    public static readonly smCOULDNTOPENDATABASEFAILUREMSG: string = "Couldnt open database";
    public static readonly smCREATETABLESFAILUREMSG: string = "Failed to create tables";
    public static readonly smALREADYEXISTSFAILUREMSG: string = "Language already exists";    
}