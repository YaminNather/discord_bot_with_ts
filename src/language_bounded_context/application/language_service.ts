import { autoInjectable, inject, injectable } from "tsyringe";
import Failure from "../../common/datatypes/failure/failure";
import ILanguageRepository from "../domain/i_language_repository";
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
    
    public async fcheckAvailability(name: string): Promise<boolean | Failure> {
        return this.mlanguageRepo.fcheckAvailability(name);
    }

    private fvalidateName(name: String): boolean {
        return true;
    }    
    

    


    private mlanguageRepo: ILanguageRepository;

    public static readonly smINVALIDLANGUAGENAMEFAILUREMSG: string = "Invalid Name for language";
    public static readonly smLANGUAGEALREADYAVAILABLEFAILUREMSG: string = "Language already available";
}