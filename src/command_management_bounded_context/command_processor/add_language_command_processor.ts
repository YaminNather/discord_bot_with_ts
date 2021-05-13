import { Message } from "discord.js";
import { container } from "tsyringe";
import Failure from "../../common/datatypes/failure/failure";
import { gfhasDigits, gfhasSymbols } from "../../common/helpers/string_utils";
import LanguagesService from "../../language_bounded_context/application/language_service";
import Command from "../input_command/command";
import CommandProcessor from "./command_processor";

export default class AddLanguageCommandProcessor extends CommandProcessor {
    // constructor(mlanguageService: LanguagesService) {
    //     super();
        
    //     this.mlanguageService = mlanguageService;
    // }

    public fcheckCompatibilityWithCommand(command: Command): boolean {
        if(!super.fcheckCompatibilityWithCommand(command))
            return false;
            
        if(command.mparameters.length != 1)
            return false;        

        const parameter: string = command.mparameters[0];

        if(gfhasSymbols(parameter) || gfhasDigits(parameter))
            return false;        

        return true;
    }

    public async fhandleCommand(message: Message, command: Command): Promise<void | Failure> {
        const languageName: string = command.mparameters[0];    
            
        const addLanguageResponse: void | Failure = await this.mlanguageService.faddLanguage(languageName);
        
        if(addLanguageResponse instanceof Failure) {
            await message.reply(`Failed to add ${languageName} language - ${addLanguageResponse.msg}`);
            return;
        }

        await message.reply(`${languageName} language added`);
    }

    public fgetName(): string {
        return this.mname;
    }

    public fgetSyntax(): string {
        return this.msyntax;
    }

    private readonly mname: string = "addlanguage";
    private readonly msyntax: string = `!addlanguage <name>`;

    private mlanguageService: LanguagesService = container.resolve(LanguagesService);
}