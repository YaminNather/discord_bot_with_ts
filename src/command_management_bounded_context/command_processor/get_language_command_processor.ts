import { Message } from "discord.js";
import { container } from "tsyringe";
import Failure from "../../common/datatypes/failure/failure";
import LanguagesService from "../../language_bounded_context/application/language_service";
import BadWord from "../../language_bounded_context/domain/models/bad_word";
import Language from "../../language_bounded_context/domain/models/language";
import Command from "../input_command/command";
import CommandProcessor from "./command_processor";

export class GetLanguageCommandProcessor extends CommandProcessor {  
    public fcheckCompatibilityWithCommand(command: Command): boolean {
        const nameCompatibility: boolean = super.fcheckCompatibilityWithCommand(command);

        let parametersCompatibility: boolean = true;
        
        if(command.mparameters.length != 1)
            parametersCompatibility = false;

        const parameter: string = command.mparameters[0];

        if(/^[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?123456789]*$/.test(parameter))
            parametersCompatibility = false;

        return nameCompatibility && parametersCompatibility;
    }

    public async fhandleCommand(message: Message, command: Command): Promise<void | Failure> {
        const getLanguageResponse: Language | undefined | Failure = await this.mlanguageService.fgetLanguage(command.mparameters[0]);

        if(getLanguageResponse instanceof Failure)
            return new Failure(`Failed to get language ${command.mparameters[0]} - ${getLanguageResponse.msg}`);        
        
        if(getLanguageResponse == undefined) {
            message.reply(`Language ${command.mparameters[0]} not available`);
            
            return;
        }

        const language: Language = getLanguageResponse;

        console.log(`Language ${language.mname} available`);
        
        let reply: string = `${language.mname} bad words:`;
        for(let i: number = 0; i < language.mbadWords.length; i++) {
            const badWord: BadWord = language.mbadWords[i];
            reply += `\n\t${badWord.mname} - ${badWord.mmeaning}`;
        }
        
        message.reply(reply);

    }

    public fgetName(): string {
        return this.mname;
    }


    private readonly mname: string = "getbadwords";
    private mlanguageService: LanguagesService = container.resolve(LanguagesService);
}