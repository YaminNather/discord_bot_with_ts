import { autoInjectable, inject, injectable } from "tsyringe";
import Failure from "../../common/datatypes/failure/failure";
import ILanguageRepository from "../domain/i_language_repository";
import BadWord from "../domain/models/bad_word";
import Language from "../domain/models/language";

@injectable()
export default class LanguagesService {
    constructor(@inject("ILanguageRepository") mlanguageRepo: ILanguageRepository) {
        this.mlanguageRepo = mlanguageRepo;

        this.faddLanguage = this.faddLanguage.bind(this);
        this.fgetLanguage = this.fgetLanguage.bind(this);
    }

    public async faddLanguage(name: string): Promise<void | Failure> {
        name = name.toLowerCase();
        
        if(!this.fvalidateName(name))
            return new Failure(LanguagesService.smINVALIDLANGUAGENAMEFAILUREMSG);

        const checkAvailabilityResponse: boolean | Failure = await this.mlanguageRepo.fcheckAvailability(name);
        if(checkAvailabilityResponse instanceof Failure)
            return checkAvailabilityResponse;

        const availability: boolean = checkAvailabilityResponse;
        if(availability == true)
            return new Failure(LanguagesService.smLANGUAGEALREADYAVAILABLEFAILUREMSG);        

        const language: Language = new Language(name, []);
        
        return await this.mlanguageRepo.fstore(language);        
    }
    
    public async fgetLanguage(name: string): Promise<(Language | undefined) | Failure> {
        name = name.toLowerCase();
        
        if(!this.fvalidateName(name))
            return new Failure(LanguagesService.smINVALIDLANGUAGENAMEFAILUREMSG);

        return await this.mlanguageRepo.fget(name);
    }

    public async faddBadWord(languageName: string, name: string, meaning: string): Promise<void | Failure> {
        languageName = languageName.toLowerCase();
        name = name.toLowerCase();
        meaning = meaning.toLowerCase();

        const getLanguageResponse: Language | undefined | Failure = await this.fgetLanguage(languageName);
        
        if(getLanguageResponse instanceof Failure) {
            return getLanguageResponse;
        }

        const language: Language | undefined = getLanguageResponse;
        if(language == undefined)
            return new Failure(`Language not available`);
            
        if(language.fcontainsBadWord(name, meaning))
            return new Failure(`Already contains bad word with same meaning`);

        language.faddBadWord(name, meaning);
        
        const storeRes: void | Failure = await this.mlanguageRepo.fstore(language);
        if(storeRes instanceof Failure)
            return storeRes;
        
        console.log(`Stored new language`);
    }

    public async fremoveBadWord(languageName: string, name: string, meaning: string): Promise<void | Failure> {
        const getLanguageRes: Language | undefined | Failure = await this.fgetLanguage(languageName);
        
        if(getLanguageRes instanceof Failure)
            return getLanguageRes;

        if(getLanguageRes == undefined)
            return new Failure(`Language ${languageName} not available`);

        const language: Language = getLanguageRes;
        const badWord: BadWord | undefined = language.fgetBadWordWith(name, meaning);
        if(badWord == undefined)
            return new Failure(`Bad word ${name} in language ${languageName} not available`);
            
        language.fremoveBadWord(badWord.mid);
        
        const storeResponse: void | Failure = await this.mlanguageRepo.fstore(language);

        if(storeResponse instanceof Failure) 
            return storeResponse;        
    }
    
    public async fcheckAvailability(name: string): Promise<boolean | Failure> {
        return this.mlanguageRepo.fcheckAvailability(name);
    }    

    private fvalidateName(name: String): boolean {
        return true;
    }    
    
    public fgetAllLanguageNames(): Promise<string[] | Failure> {
        return this.mlanguageRepo.fgetAllNames();
    }
    
    public async fgetAllLanguages(): Promise<Language[] | Failure> {
        const getAllLanguageNamesRes: string[] | Failure = await this.mlanguageRepo.fgetAllNames();
        
        if(getAllLanguageNamesRes instanceof Failure)
            return getAllLanguageNamesRes;

        const languageNames: string[] = getAllLanguageNamesRes;

        const r: Language[] = [];        
        
        for(const languageName of languageNames) {
            const getLanguageRes: Language | undefined | Failure = await this.mlanguageRepo.fget(languageName);

            if(getLanguageRes instanceof Failure)
                return getLanguageRes;

            if(getLanguageRes == undefined)
                continue;

            r.push(getLanguageRes);
        }

        return r;
    }


    private mlanguageRepo: ILanguageRepository;

    public static readonly smINVALIDLANGUAGENAMEFAILUREMSG: string = "Invalid Name for language";
    public static readonly smLANGUAGEALREADYAVAILABLEFAILUREMSG: string = "Language already available";
}