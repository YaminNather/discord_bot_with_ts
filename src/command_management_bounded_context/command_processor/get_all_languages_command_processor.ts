import { Message } from "discord.js";
import { container } from "tsyringe";
import { LanguageService } from "typescript";
import Failure from "../../common/datatypes/failure/failure";
import LanguagesService from "../../language_bounded_context/application/language_service";
import Command from "../input_command/command";
import CommandProcessor from "./command_processor";

export default class GetAllLanguagesCommandProcessor extends CommandProcessor {
    public fcheckCompatibilityWithCommand(command: Command): boolean {        
        return super.fcheckCompatibilityWithCommand(command) && command.mparameters.length == 0;
    }
    
    public async fhandleCommand(message: Message, command: Command): Promise<void | Failure> {
        const getAllLangugageNamesRes: string[] | Failure = await this.mlanguagesService.fgetAllLanguageNames();

        if(getAllLangugageNamesRes instanceof Failure) {
            console.log(`Failed to get language - ${getAllLangugageNamesRes.msg}`);

            return;
        }
        
        const languageNames: string[] = getAllLangugageNamesRes;

        if(languageNames.length == 0) {
            await message.reply(`No languages available atm`);

            return;
        }

        let reply: string = "Available languages:";
        for(const languageName of languageNames)
            reply += `\n${languageName}`;
        
        await message.reply(reply);
    }

    public fgetName(): string {
        return this.mname;
    }

    public fgetSyntax(): string {
        return this.msyntax;
    }




    private readonly mname: string = `getalllanguages`;
    private readonly msyntax: string = `!getalllanguages`;
    
    private mlanguagesService: LanguagesService = container.resolve(LanguagesService);
}