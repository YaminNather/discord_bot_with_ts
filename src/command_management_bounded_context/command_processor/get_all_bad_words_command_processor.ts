import { Message } from "discord.js";
import { container } from "tsyringe";
import Failure from "../../common/datatypes/failure/failure";
import LanguagesService from "../../language_bounded_context/application/language_service";
import Language from "../../language_bounded_context/domain/models/language";
import Command from "../input_command/command";
import CommandProcessor from "./command_processor";

export default class GetAllBadWordsCommandProcessor extends CommandProcessor {
    public fcheckCompatibilityWithCommand(command: Command): boolean {
        return super.fcheckCompatibilityWithCommand(command) && command.mparameters.length == 0;
    }

    public async fhandleCommand(message: Message, command: Command): Promise<void | Failure> {
        const getLanguagesRes: Language[] | Failure = await this.mlanguagesService.fgetAllLanguages();

        if(getLanguagesRes instanceof Failure) {
            console.log(`Failed to get all languages`);

            return;
        }

        const languages: Language[] = getLanguagesRes;

        if(languages.length == 0) {
            await message.reply(`No languages added yet.`);

            return;
        }            

        let reply: string = ``;
        for(const language of languages)
            reply += `\n${this.fgetLanguageWithBadWordsAsStr(language)}`;                

        await message.reply(reply);
    }

    private fgetLanguageWithBadWordsAsStr(language: Language): string {
        if(language.fgetAllBadWords().length == 0)
            return `${language.mname} has no bad words added yet.`;
        
        let r: string = `${language.mname}:`;

        for(const badWord of language.fgetAllBadWords())
            r += `\n\t${badWord.mname} - ${badWord.mmeaning}`;        

        return r;
    }

    public fgetName(): string {
        return this.mname;
    }

    public fgetSyntax(): string {
        return this.msyntax;
    }

    

    private readonly mname: string = `getallbadwords`;
    private readonly msyntax: string = `!${this.mname}`;

    private mlanguagesService: LanguagesService = container.resolve(LanguagesService); 
}