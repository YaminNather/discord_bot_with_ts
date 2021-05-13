import { Message } from "discord.js";
import { container } from "tsyringe";
import Failure from "../../common/datatypes/failure/failure";
import { gfhasDigits, gfhasSymbols } from "../../common/helpers/string_utils";
import LanguagesService from "../../language_bounded_context/application/language_service";
import Command from "../input_command/command";
import CommandProcessor from "./command_processor";

export default class RemoveBadWordCommandProcessor extends CommandProcessor {
    public fcheckCompatibilityWithCommand(command: Command): boolean {
        if(!super.fcheckCompatibilityWithCommand(command))
            return false;

        if(command.mparameters.length != 3)
            return false;

        const languageName: string = command.mparameters[0];
        const name: string = command.mparameters[1];
        const meaning: string = command.mparameters[2];

        return !this.fparameterHasSymbolsOrDigits(languageName + name + meaning);
    }

    private fparameterHasSymbolsOrDigits(parameter: string): boolean {
        return gfhasSymbols(parameter) || gfhasDigits(parameter);
    }

    public async fhandleCommand(message: Message, command: Command): Promise<void | Failure> {
        const languageName: string = command.mparameters[0];
        const name: string = command.mparameters[1];
        const meaning: string = command.mparameters[2];

        const removeBadWordRes: void | Failure = await this.mlanguagesService.fremoveBadWord(languageName, name, meaning);

        if(removeBadWordRes instanceof Failure) {
            await message.reply(`Couldn't remove bad word ${name} from language ${languageName} - ${removeBadWordRes.msg}`);

            return;
        }
        
        await message.reply(`Removed bad word ${name} from language ${languageName}`);
    }    

    public fgetName(): string {
        return this.mname;
    }

    public fgetSyntax(): string {
        return this.msyntax;
    }





    private readonly mname: string = "removebadword";
    private readonly msyntax: string = `!removebadword <language> <name> <meaning>`;

    private readonly mlanguagesService: LanguagesService = container.resolve(LanguagesService);
}